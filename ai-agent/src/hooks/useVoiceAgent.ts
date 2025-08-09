"use client"
import { useCallback, useEffect, useRef, useState } from 'react'

export function useVoiceAgent() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (event: any) => {
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        finalText += res[0].transcript
      }
      setTranscript(finalText.trim())
    }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
  }, [])

  const start = useCallback(() => {
    if (recognitionRef.current && !listening) {
      setTranscript('')
      setListening(true)
      recognitionRef.current.start()
    }
  }, [listening])

  const stop = useCallback(() => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop()
    }
  }, [listening])

  const speak = useCallback((text: string, voice?: SpeechSynthesisVoice) => {
    if (!('speechSynthesis' in window)) return
    const utter = new SpeechSynthesisUtterance(text)
    if (voice) utter.voice = voice
    window.speechSynthesis.speak(utter)
  }, [])

  return { listening, transcript, start, stop, speak }
}