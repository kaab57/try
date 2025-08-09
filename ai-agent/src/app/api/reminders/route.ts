import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const reminders = await prisma.reminder.findMany({ orderBy: { dueAt: 'asc' } })
  return NextResponse.json({ reminders })
}

export async function POST(req: NextRequest) {
  const { title, description, dueAt } = await req.json()
  if (!title || !dueAt) return NextResponse.json({ error: 'title and dueAt required' }, { status: 400 })
  const reminder = await prisma.reminder.create({ data: { title, description, dueAt: new Date(dueAt) } })
  return NextResponse.json({ reminder })
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const reminder = await prisma.reminder.update({ where: { id: Number(id) }, data })
  return NextResponse.json({ reminder })
}