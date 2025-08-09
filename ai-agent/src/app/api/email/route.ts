import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  const { to, subject, text, html } = await req.json()
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'Agent <agent@example.com>'
  const port = Number(process.env.SMTP_PORT || 587)

  if (!host || !user || !pass) {
    return Response.json({ ok: true, demo: true })
  }

  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
  await transporter.sendMail({ from, to, subject, text, html })
  return Response.json({ ok: true })
}