<div align="center">
  <img src="public/logo.png" alt="ClearNotes logo" width="80" />
  <h1>ClearNotes</h1>
  <p><strong>Less Reading. More Understanding.</strong></p>
  <p>Upload a document — get structured, AI-generated notes in seconds.</p>

  <p>
    <a href="https://github.com/Mebaww/ClearNotes/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/badge/license-MIT-gold?style=flat-square" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
    <img alt="Gemini AI" src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google" />
    <img alt="PWA" src="https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square" />
  </p>
</div>

---

## What is ClearNotes?

ClearNotes is a **document intelligence web app** that transforms dense PDFs, Word documents, and PowerPoint decks into clean, structured Markdown notes using Google's Gemini AI.

Instead of reading a 40-page report, you upload it and get the key ideas, definitions, data points, and conclusions — organized and scannable in seconds. It's built for students, researchers, and professionals who need to process a lot of information quickly.

### Core workflow

```
Upload document  →  Parse & extract text  →  Gemini AI structures notes  →  Read, review, organize
```

---

## Features

| Feature | Details |
|---|---|
| **Multi-format support** | PDF, DOCX, DOC, PPTX |
| **AI note generation** | Powered by Google Gemini — signal-over-noise extraction with LaTeX math support |
| **Folder organization** | Create and manage folders to group related notes |
| **Markdown rendering** | Full GFM + KaTeX for equations and formulas |
| **Google OAuth** | One-click sign-in, no passwords |
| **Monthly usage tracking** | Per-user credit system with automatic monthly reset |
| **Dark / light theme** | System-aware, fully styled in both modes |
| **PWA support** | Installable on desktop, Android, and iOS home screen |
| **Persistent sessions** | Rolling 30-day sessions — stay logged in |

---

## Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) — full-stack React framework
- **[React 19](https://react.dev/)** — concurrent rendering
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Radix UI](https://www.radix-ui.com/)** — accessible, composable components
- **[Lucide React](https://lucide.dev/)** — icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark mode

### Backend & Data
- **[PostgreSQL](https://www.postgresql.org/)** — primary database
- **[Prisma ORM](https://www.prisma.io/)** — type-safe database client with migrations
- **[better-auth](https://www.better-auth.com/)** — authentication with Google OAuth and session management

### AI & Document Processing
- **[Google Gemini](https://ai.google.dev/)** (`@google/generative-ai`) — note generation model
- **[pdfjs-dist](https://github.com/mozilla/pdf.js)** — client-side PDF text extraction
- **[mammoth](https://github.com/mwilliamson/mammoth.js)** — DOCX / DOC parsing
- **[jszip](https://stuk.github.io/jszip/)** — PPTX slide extraction

### Infrastructure
- **[better-auth/infra](https://www.better-auth.com/)** — analytics & auth dashboard
- **[@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)** — Google Analytics
- **Service Worker** — custom caching strategy + PWA offline support

---

## Project Structure

```
clearnotes/
├── app/
│   ├── api/               # API routes (notes, folders, auth, stats, waitlist)
│   ├── auth/              # Auth callback pages
│   ├── onboarding/        # New user onboarding flow
│   ├── workspace/         # Main app (notes list, note viewer, settings)
│   ├── layout.tsx          # Root layout with metadata, theme, SW registration
│   ├── manifest.ts         # PWA web app manifest
│   └── page.tsx            # Landing page
│
├── components/
│   ├── hero/              # Landing page hero, animation, CTA
│   ├── workspace/         # DocumentUploader, NoteCard, NoteViewer, FolderManager
│   └── ui/                # shadcn/ui base components
│
├── lib/
│   ├── ai/                # Gemini client, note generation, prompts
│   ├── parse/             # Document parsers (PDF, DOCX, PPTX)
│   ├── auth.ts             # better-auth configuration
│   └── prisma.ts           # Prisma client singleton
│
├── prisma/
│   └── schema.prisma       # Database schema (User, Note, Folder, Session…)
│
└── public/
    ├── logo.png            # Transparent app logo
    ├── icon-192x192.png    # PWA icon
    ├── icon-512x512.png    # PWA icon
    └── sw.js               # Service worker
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** database (local or hosted, e.g. Neon, Supabase, Railway)
- **Google OAuth** credentials — [create here](https://console.cloud.google.com/)
- **Google Gemini API key** — [get here](https://ai.google.dev/)

### 1. Clone the repository

```bash
git clone https://github.com/Mebaww/ClearNotes.git
cd ClearNotes
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root by copying the example below:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/clearnotes

# Authentication (better-auth)
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
BETTER_AUTH_API_KEY=your-better-auth-infra-key
```

### 3. Set up the database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How the AI Works

ClearNotes uses a carefully engineered **high-fidelity extraction prompt** to guide Gemini:

- **Signal** (always preserved): thesis statements, definitions, quantitative data, formulas, methodologies, key examples
- **Noise** (safely removed): filler text, repetition, rhetorical questions, OCR artifacts, transitional sentences
- **Output format**: strict Markdown with H1 → H2 → H3 hierarchy, bullet points, and LaTeX for math (`$inline$` / `$$block$$`)

The model is explicitly instructed **never to hallucinate** — it only works with what's in the document.

---

## Database Schema

```
User          — id, name, email, monthlyCreditsUsed, usageResetAt
Note          — id, title, sourceText, generated (Markdown), status, userId, folderId
Folder        — id, name, userId
Session       — id, token, expiresAt, userId
Account       — OAuth account linkage
Verification  — Email verification tokens
Waitlist      — Pre-launch waitlist with invite tracking
```

---

## PWA Support

ClearNotes is a fully installable Progressive Web App:

- **Web App Manifest** (`/manifest.webmanifest`) — name, icons, theme color, display mode
- **Service Worker** (`/sw.js`) — network-first for pages/API, cache-first for static assets
- **iOS support** — `apple-touch-icon`, `apple-mobile-web-app-capable`, translucent status bar
- **Theme color** — `#C49A3C` (amber/gold matching the brand)

---

## Contributing

Contributions, bug reports, and feature requests are welcome.

1. Fork the repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

MIT © [meva.work](https://meva.work)
