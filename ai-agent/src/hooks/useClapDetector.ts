"use client"
import { useEffect, useRef, useState } from 'react'

export function useClapDetector({ threshold = 0.75, cooldownMs = 1500 } = {}) {
  const [triggeredAt, setTriggeredAt] = useState<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<any>(null)

  useEffect(() => {
    let raf = 0
    let lastTrigger = 0
    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
        audioContextRef.current = ctx
        const source = ctx.createMediaStreamSource(stream)
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 2048
        analyserRef.current = analyser
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as any
        source.connect(analyser)
        function tick() {
          if (!analyserRef.current || !dataArrayRef.current) return
          const arr: Uint8Array = dataArrayRef.current as any
          ;(analyserRef.current as any).getByteFrequencyData(arr as any)
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length / 255
          const now = Date.now()
          if (avg > threshold && now - lastTrigger > cooldownMs) {
            lastTrigger = now
            setTriggeredAt(now)
          }
          raf = requestAnimationFrame(tick)
        }
        tick()
      } catch (e) {
        // ignore
      }
    }
    setup()
    return () => cancelAnimationFrame(raf)
  }, [threshold, cooldownMs])

  return { triggeredAt }
}