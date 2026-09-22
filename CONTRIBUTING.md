# Contributing to ClearNotes

Thanks for your interest in contributing to ClearNotes. We welcome contributions of all kinds, from fixing bugs and improving document parsers to refining the UI and documentation.

This guide covers local development setup, coding standards, and how to submit a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Installation](#step-by-step-installation)
  - [Environment Variables](#environment-variables)
  - [Database Operations](#database-operations)
- [Architecture & Codebase Overview](#architecture--codebase-overview)
- [Technical Standards & Conventions](#technical-standards--conventions)
  - [TypeScript Strictness](#typescript-strictness)
  - [Next.js 16 & React 19 Best Practices](#nextjs-16--react-19-best-practices)
  - [Styling & Design System (Tailwind CSS v4 + shadcn/ui)](#styling--design-system-tailwind-css-v4--shadcnui)
  - [Client-Side Document Parsing](#client-side-document-parsing)
  - [Security & Secrets](#security--secrets)
- [Git & Contribution Workflow](#git--contribution-workflow)
  - [Branch Naming](#branch-naming)
  - [Commit Message Conventions](#commit-message-conventions)
  - [Pre-Submission Checklist](#pre-submission-checklist)
  - [Submitting Your Pull Request](#submitting-your-pull-request)
- [Review Process](#review-process)
- [Need Help?](#need-help)

---

## Code of Conduct

All contributors and community members are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to ensure a respectful, welcoming, and harassment-free environment for everyone.

---

## Ways to Contribute

1. **Report Bugs**: Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.yml) to detail unexpected behavior with clear reproduction steps.
2. **Suggest Features**: Submit an idea using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.yml).
3. **Improve Documentation**: Found an outdated section or unclear step? Open a PR or submit a [Docs Issue](.github/ISSUE_TEMPLATE/documentation.yml).
4. **Solve Open Issues**: Look for issues labeled [`good first issue`](https://github.com/Mebaww/ClearNotes/labels/good%20first%20issue) or [`help wanted`](https://github.com/Mebaww/ClearNotes/labels/help%20wanted).
5. **Code Reviews**: Help review pull requests opened by other community members.

---

## Development Setup

### Prerequisites

Make sure you have installed:

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher (or equivalent `pnpm`/`yarn`)
- **PostgreSQL**: Local database or hosted instance (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Railway)
- **Google Cloud Console account**: For Google OAuth 2.0 credentials
- **Google AI Studio account**: For a [Gemini API Key](https://aistudio.google.com/app/apikey)

### Step-by-Step Installation

1. **Fork the Repository**
   Click the **Fork** button at the top right of the [ClearNotes GitHub repository](https://github.com/Mebaww/ClearNotes).

2. **Clone your fork locally**
   ```bash
   git clone https://github.com/<your-username>/ClearNotes.git
   cd ClearNotes
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/Mebaww/ClearNotes.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your values (see [Environment Variables](#environment-variables) below).

6. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

7. **Start the local development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Environment Variables

Your `.env` file should contain the following settings:

| Variable | Description | Example / Note |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Base application URL | `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/clearnotes` |
| `BETTER_AUTH_SECRET` | 32+ character random secret | Generate via `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Base auth URL | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console | `...apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console | Google OAuth client secret |
| `GEMINI_API_KEY` | API Key from Google AI Studio | Personal key for testing note generation |
| `GEMINI_MODEL` | Gemini model version | Default: `gemini-2.5-flash` |

> [!TIP]
> When setting up Google OAuth in Google Cloud Console, register `http://localhost:3000/api/auth/callback/google` under **Authorized redirect URIs**.

---

### Database Operations

ClearNotes uses **Prisma ORM 7** with PostgreSQL.

- **Apply existing migrations**:
  ```bash
  npx prisma migrate deploy
  ```
- **Create a new migration after editing `prisma/schema.prisma`**:
  ```bash
  npx prisma migrate dev --name describe_your_change
  ```
- **Re-generate Prisma Client types**:
  ```bash
  npx prisma generate
  ```
- **Explore data visually in browser**:
  ```bash
  npx prisma studio
  ```

---

## Architecture & Codebase Overview

```
clearnotes/
├── app/
│   ├── api/                 # Next.js route handlers (notes, folders, auth, stats)
│   ├── auth/                # Sign-in and OAuth callback pages
│   ├── onboarding/          # Interactive user onboarding flow
│   ├── share/               # Public and shared note/folder viewer routes
│   ├── workspace/           # Main user app (dashboard, notes list, viewer, settings)
│   ├── layout.tsx           # Root layout with metadata, theme, and PWA setup
│   └── page.tsx             # Landing page
│
├── components/
│   ├── hero/                # Landing page hero, interactive visualizer, and navbar
│   ├── workspace/           # Document uploader, note cards, note viewer, folders
│   └── ui/                  # Reusable UI primitives (shadcn / Radix)
│
├── hooks/                   # Custom React hooks (use-mobile, use-mounted, etc.)
├── lib/
│   ├── ai/                  # Gemini client, extraction pipelines, prompt templates
│   ├── notes/               # Database operations for notes, folders, and shares
│   ├── parse/               # Client-side parsers (PDF, DOCX, PPTX)
│   ├── usage/               # Monthly quota and credit tracking
│   ├── auth.ts              # Server-side better-auth configuration
│   ├── auth-client.ts       # Client-side better-auth helpers
│   ├── env.ts               # Zod validation schema for environment variables
│   └── prisma.ts            # Prisma client singleton
│
├── prisma/                  # Prisma schema and migrations
└── public/                  # Static assets, icons, and service worker (sw.js)
```

---

## Technical Standards & Conventions

### TypeScript Strictness
- ClearNotes is written in strict TypeScript.
- **Do not use `any`**. Use explicit types, generics, or `unknown` with type guards.
- Keep shared types organized in `types/` or co-located with their feature modules.
- Ensure all types pass `npx tsc --noEmit`.

### Next.js 16 & React 19 Best Practices
- **Server Components by Default**: Only add `"use client"` when component requires client state, browser events, or window APIs.
- **Async Dynamic APIs**: Note that in Next.js 16, dynamic route parameters (e.g. `params`, `searchParams`) are asynchronous promises. Always `await` them.
- **API Error Handling**: Use structured JSON error responses with proper HTTP status codes. Use helper classes from `lib/errors.ts`.

### Styling & Design System (Tailwind CSS v4 + shadcn/ui)
- Use **Tailwind CSS v4** utility classes.
- Ensure full **dark mode** and **light mode** compatibility using `next-themes` semantic color variables (`bg-background`, `text-foreground`, `border-border`, `bg-muted`, etc.).
- Ensure all UI is **fully responsive** and tested across mobile (`< 640px`), tablet (`768px`), and desktop (`1024px+`) viewports.

### Client-Side Document Parsing
- Text extraction for documents (PDF, DOCX, PPTX) is executed **in the client's browser** to preserve user privacy and reduce server overhead.
- When working on parsers in `lib/parse/`, handle empty files, corrupted archives, password-protected files, and unsupported formats gracefully with user-friendly error messages.

### Security & Secrets
- **Never** commit `.env` files, API keys, or private database connection strings.
- Validate all incoming user input on server endpoints using **Zod** or Prisma schemas.
- Ensure user authorization is checked on every database query so users only access their own notes or explicitly shared resources.

---

## Git & Contribution Workflow

### Branch Naming

Create a feature branch from the latest `main`:

```bash
git checkout -b <type>/<short-description>
```

Examples:
- `feat/export-notes-markdown`
- `fix/pptx-parser-empty-slides`
- `docs/add-neon-setup-guide`
- `refactor/note-card-actions`

### Commit Message Conventions

We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: add PDF batch download support`
- `fix: resolve mobile navigation backdrop blur`
- `docs: clarify Google Cloud OAuth setup in CONTRIBUTING.md`
- `style: fix alignment on folder modal buttons`
- `refactor: extract note viewer toolbar into subcomponent`
- `perf: optimize client-side PDF text extraction loop`
- `chore: update dependencies`

Keep commit messages concise and descriptive in the imperative tense ("add", not "added" or "adds").

---

### Pre-Submission Checklist

Before pushing your changes, run these automated checks locally:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Production build test
npm run build
```

All three commands must exit with code `0`.

---

### Submitting Your Pull Request

1. **Push your branch to your fork**:
   ```bash
   git push -u origin <type>/<short-description>
   ```

2. **Open a Pull Request**:
   - Navigate to the ClearNotes repository on GitHub.
   - Click **Compare & pull request**.
   - Ensure the base repository is `Mebaww/ClearNotes` and base branch is `main`.
   - Fill out the provided [Pull Request Template](.github/pull_request_template.md).
   - If your PR introduces visual changes, please include **before and after screenshots or GIFs**.
   - Link any relevant issues (e.g., `Closes #42`).

3. **CI Validation**:
   - Automated GitHub Actions will run type checks, linting, and build verification.
   - If CI fails, click on "Details", inspect the error, and push fixes to your branch.

---

## Review Process

Once submitted:

- Maintainers will review your PR and leave feedback inline.
- Once requested changes are addressed and CI checks pass, your PR will be approved and merged into `main`.

---

## Need Help?

If you have questions or get stuck at any point, feel free to open an issue or start a discussion on GitHub.

Thanks for helping improve ClearNotes!
