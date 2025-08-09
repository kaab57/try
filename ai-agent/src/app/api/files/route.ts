import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SANDBOX = path.join(process.cwd(), 'sandbox')
function ensureSandbox() { if (!fs.existsSync(SANDBOX)) fs.mkdirSync(SANDBOX, { recursive: true }) }

export async function GET() {
  ensureSandbox()
  const entries = fs.readdirSync(SANDBOX, { withFileTypes: true }).map(e => ({
    name: e.name,
    type: e.isDirectory() ? 'dir' : 'file'
  }))
  return NextResponse.json({ entries })
}

export async function POST(req: NextRequest) {
  ensureSandbox()
  const { action, name, content } = await req.json()
  const target = path.join(SANDBOX, name || '')
  if (action === 'create-file') {
    fs.writeFileSync(target, content ?? '')
    return NextResponse.json({ ok: true })
  }
  if (action === 'create-folder') {
    fs.mkdirSync(target, { recursive: true })
    return NextResponse.json({ ok: true })
  }
  if (action === 'delete') {
    if (fs.existsSync(target)) {
      const stat = fs.statSync(target)
      if (stat.isDirectory()) fs.rmSync(target, { recursive: true, force: true })
      else fs.unlinkSync(target)
    }
    return NextResponse.json({ ok: true })
  }
  if (action === 'read') {
    const data = fs.readFileSync(target, 'utf8')
    return NextResponse.json({ content: data })
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}