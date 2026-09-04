<div align="center">
  <img src="public/logo.png" alt="ClearNotes logo" width="80" />
  <h1>ClearNotes</h1>
  <p><strong>Less Reading. More Understanding.</strong></p>
  <p>Turn documents into clean, structured notes powered by AI</p>
  <p>
    <a href="LICENSE"><img alt="License" src="https://img.shields.io/badge/License-MIT-green?style=flat-square" /></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
    <img alt="Gemini AI" src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google" />
    <img alt="PWA" src="https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square" />
  </p>
</div>

---

## What is ClearNotes?

ClearNotes is an **open-source document intelligence web app** that transforms dense PDFs, Word documents, and PowerPoint presentations into clean, structured Markdown notes using Google's Gemini AI.

Instead of reading a 40-page report or slide deck, you upload it and receive key ideas, definitions, data points, and conclusions — organized and scannable in seconds. It is built for students, researchers, and professionals who need to process large volumes of information quickly.

### Core Workflow

🌐 **Live Demo:** [clearnotes.xyz](https://clearnotes.xyz)

```
Upload document  →  Parse & extract text  →  Gemini AI structures notes  →  Read, review, organize & share
```

---

## Features

| Feature | Details |
|---|---|
| **Multi-format parsing** | Client-side text extraction for PDF, DOCX, and PPTX (with guidance for legacy DOC) |
| **AI note generation** | Powered by Google Gemini — signal-over-noise extraction with LaTeX math equations |
| **Note styles** | Choose between Standard, Study Guide, or Research Deep-Dive modes |
| **Folder organization** | Create and manage custom folders to group related documents |
| **Sharing & access** | Generate share links for individual notes or entire folders with view tracking |
| **Markdown rendering** | Full GitHub Flavored Markdown (GFM) + KaTeX for mathematical notation |
| **Google OAuth** | Fast and secure one-click sign-in via better-auth |
| **Monthly usage credits** | Fair per-user credit allocation with automatic monthly reset |
| **Dark / light mode** | System-aware theme with persistent preferences |
| **PWA support** | Installable on desktop, Android, and iOS home screens with offline caching |
| **Persistent sessions** | 30-day rolling sessions with automatic silent refresh |

---

## Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) — full-stack React framework
- **[React 19](https://react.dev/)** — modern hooks, server components, and concurrent rendering
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Radix UI](https://www.radix-ui.com/)** — accessible, composable UI primitives
- **[Lucide React](https://lucide.dev/)** — icon system
- **[next-themes](https://github.com/pacocoursey/next-themes)** — dark and light theme management

### Backend & Data
- **[PostgreSQL](https://www.postgresql.org/)** — relational database
- **[Prisma ORM 7](https://www.prisma.io/)** — type-safe schema modeling, connection pooling, and migrations
- **[better-auth](https://www.better-auth.com/)** — authentication with Google OAuth and session management

### AI & Document Processing
- **[Google Gemini](https://ai.google.dev/)** (`@google/generative-ai`) — structured note generation
- **[pdfjs-dist](https://github.com/mozilla/pdf.js)** — PDF text extraction
- **[mammoth](https://github.com/mwilliamson/mammoth.js)** — Word document (.docx) parsing
- **[jszip](https://stuk.github.io/jszip/)** — PowerPoint presentation (.pptx) extraction

### Infrastructure & PWA
- **Service Worker** (`/sw.js`) — network-first strategy for dynamic content, cache-first for static assets
- **[@next/third-parties](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)** — optional Google Analytics integration

---

## Project Structure

```
clearnotes/
├── app/
│   ├── api/                 # REST API routes (notes, folders, auth, stats, waitlist)
│   ├── auth/                # Sign-in and OAuth callback pages
│   ├── onboarding/          # Interactive user onboarding flow
│   ├── share/               # Public and shared note/folder viewer routes
│   ├── workspace/           # Main application (dashboard, notes list, viewer, settings)
│   ├── layout.tsx           # Root layout with metadata, theme, and PWA registration
│   ├── manifest.ts          # PWA web app manifest
│   └── page.tsx             # Landing page
│
├── components/
│   ├── hero/                # Landing page hero, interactive animation, and navbar
│   ├── workspace/           # DocumentUploader, NoteCard, NoteViewer, FolderManager
│   └── ui/                  # shadcn/ui reusable component library
│
├── hooks/
│   ├── use-mobile.ts        # Responsive breakpoint detection via useSyncExternalStore
│   └── use-mounted.ts       # Hydration-safe client mount hook
│
├── lib/
│   ├── ai/                  # Gemini client, note generation pipelines, prompts
│   ├── notes/               # Database operations for notes, folders, and shares
│   ├── parse/               # Document parsers (PDF, DOCX, PPTX)
│   ├── usage/               # Credit tracking and monthly quota enforcement
│   ├── auth.ts              # Server-side better-auth configuration
│   ├── auth-client.ts       # Client-side authentication helpers
│   ├── env.ts               # Environment variable validation schema
│   ├── errors.ts            # Typed AppError classes and HTTP status mapping
│   └── prisma.ts            # Prisma client singleton with connection pooling
│
├── prisma/
│   ├── schema.prisma        # Database schema (User, Note, Folder, Shares…)
│   └── migrations/          # Version-controlled database migrations
│
└── public/
    ├── logo.png             # Application logo
    ├── icon-192x192.png     # PWA icon
    ├── icon-512x512.png     # PWA icon
    └── sw.js                # Service worker script
```

---

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** database (local instance or hosted via Neon, Supabase, Railway, etc.)
- **Google OAuth credentials** — [Google Cloud Console](https://console.cloud.google.com/)
- **Google Gemini API key** — [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/Mebaww/ClearNotes.git
cd ClearNotes
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/clearnotes

# Authentication (better-auth)
BETTER_AUTH_SECRET=your-random-secret-at-least-32-chars
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Optional
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# BETTER_AUTH_API_KEY=your-better-auth-dash-api-key
```

### 3. Set up the database

Run migrations to create the database tables and generate the Prisma client:

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

ClearNotes uses a specialized **high-fidelity extraction prompt** to guide Gemini:

- **Signal** (always preserved): thesis statements, definitions, quantitative data, formulas, methodologies, and key examples
- **Noise** (safely removed): filler text, repetition, rhetorical questions, OCR artifacts, and transitional sentences
- **Output format**: strict Markdown with H1 → H2 → H3 hierarchy, bullet points, and LaTeX for math (`$inline$` / `$$block$$`)
- **No hallucination**: The model is instructed to strictly work with the source document content.

---

## Database Schema

```
User             — id, name, email, monthlyCreditsUsed, usageResetAt
Note             — id, title, sourceText, generated (Markdown), status, userId, folderId
NoteShare        — id, noteId, token, enabled, passwordHash, expiresAt, viewCount
UserNoteAccess   — id, userId, shareId, accessedAt
Folder           — id, name, userId
FolderShare      — id, folderId, token, enabled, passwordHash, expiresAt, viewCount
UserFolderAccess — id, userId, shareId, accessedAt
Session          — id, token, expiresAt, userId
Account          — OAuth provider account linkage
Verification     — Email verification tokens
Waitlist         — Pre-launch waitlist with invite tracking
```

---

## PWA Support

ClearNotes is a fully installable Progressive Web App:

- **Web App Manifest** (`/manifest.webmanifest`) — name, icons, theme color, display mode
- **Service Worker** (`/sw.js`) — network-first for pages/API, cache-first for static assets
- **iOS support** — `apple-touch-icon`, `apple-mobile-web-app-capable`, translucent status bar
- **Theme color** — `#C49A3C` (brand gold)

---

## Contributing

Contributions are welcome! Please check our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) to get started.

---

## License

Distributed under the [MIT License](LICENSE). Copyright © 2026 Meba Wondwesen.
