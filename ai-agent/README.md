# AI Agent (Next.js)

A friendly, powerful daily AI agent with chat, voice, clap trigger, reminders, code studio, image generation, news & weather, files sandbox, email sending, and settings.

## Quickstart

```bash
npm install
npm run db:push
npm run dev
```

Optional envs: copy `.env.example` to `.env` and fill provider keys.

## Features
- Chat with voice (Web Speech API) and clap/snap trigger
- Code Studio (Monaco) with preview placeholder
- Image generation (Stability if key, fallback to picsum)
- Reminders (SQLite via Prisma)
- News (Google News RSS) & Weather (Open-Meteo)
- Files sandbox (create/read/delete)
- Email sending (SMTP or demo)
- Settings for theme and voice

## Notes
This is web demo friendly. For native system control (open apps, manage OS files, notifications), wrap with Electron/Tauri.