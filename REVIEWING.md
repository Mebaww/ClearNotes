# Pull Request Review Guidelines

This guide is designed for **ClearNotes maintainers and code reviewers**. It outlines our review philosophy, step-by-step triage workflow, technical checklists, and local testing commands to ensure every pull request merged into `main` is secure, high quality, and welcoming to contributors.

---

## Table of Contents

- [Review Philosophy](#review-philosophy)
- [Step-by-Step Review Workflow](#step-by-step-review-workflow)
- [ClearNotes Technical Review Checklist](#clearnotes-technical-review-checklist)
  - [1. Security & Authentication](#1-security--authentication)
  - [2. Database & Prisma Operations](#2-database--prisma-operations)
  - [3. AI & Gemini API Handling](#3-ai--gemini-api-handling)
  - [4. Next.js 16 & React 19 Patterns](#4-nextjs-16--react-19-patterns)
  - [5. UI, Responsiveness & Theming](#5-ui-responsiveness--theming)
- [Testing Pull Requests Locally](#testing-pull-requests-locally)
- [Communication & Feedback Templates](#communication--feedback-templates)
- [Merging Strategy](#merging-strategy)

---

## Review Philosophy

1. **Be welcoming and appreciative**: Contributors are dedicating their personal time to ClearNotes. Always thank them for opening a PR, regardless of how much revision is needed.
2. **Let CI do the heavy lifting**: Do not spend time reviewing line-by-line code if the automated CI checks (TypeScript, ESLint, Next.js build) are failing. Politely ask the contributor to check CI logs first.
3. **Explain the *why***: When requesting changes, explain the reasoning (e.g., security, bundle size, edge cases, mobile UX) rather than just stating a preference.
4. **Suggest concrete fixes**: Whenever possible, use GitHub's **"Insert suggestion"** feature (` ```suggestion `) so the contributor can apply fixes with a single click.
5. **Distinguish blockers from nits**: Clearly mark non-blocking polish comments as `[Nit]` or `[Optional]` so the contributor knows what is required for merge.

---

## Step-by-Step Review Workflow

```
1. Check CI Status  →  2. High-Level Triage  →  3. Line-by-Line Review  →  4. Local Test (if UI/Core)  →  5. Merge
```

### 1. Check CI Status
- Look at the GitHub Actions status at the bottom of the PR.
- If CI is ❌ failing, leave a polite comment:
  > *"Thank you for the PR! It looks like one of the automated checks failed (e.g. typecheck or lint). Could you run `npx tsc --noEmit` and `npm run lint` locally and push a fix?"*

### 2. High-Level Triage
- **Scope**: Does this pull request solve a clear problem or address an existing issue?
- **PR Description**: Did the contributor describe what changed, test steps, and provide screenshots for visual changes?
- **Size**: Is the PR focused on a single responsibility? (If a PR changes 40 unrelated files, consider asking them to split it into smaller PRs).

### 3. Line-by-Line Review
- Use the [ClearNotes Technical Review Checklist](#clearnotes-technical-review-checklist) below.
- Focus on correctness, edge cases, security, and maintainability.

### 4. Test Locally
- For non-trivial features, bug fixes, or UI changes, pull the branch down and test it in your local environment (see [Testing Pull Requests Locally](#testing-pull-requests-locally)).

### 5. Merge
- Once approved and CI is green, merge using **Squash and Merge**.

---

## ClearNotes Technical Review Checklist

### 1. Security & Authentication
- [ ] **No Committed Secrets**: Verify no `.env`, API keys, private tokens, or connection strings are accidentally committed.
- [ ] **Session Verification**: All protected API endpoints (`app/api/...`) must verify the user's session with `better-auth` (`auth.api.getSession`).
- [ ] **Authorization & IDOR Prevention**: Every database query fetching or modifying Notes/Folders must check `userId: session.user.id`. A user must never be able to view, edit, or delete another user's notes by changing an ID in the request.
- [ ] **Share Link Safety**: Shared notes/folders accessed via `/share/...` must verify that the share token is enabled (`enabled: true`), not expired (`expiresAt > now`), and validate password hashes if password-protected.

### 2. Database & Prisma Operations
- [ ] **Migrations Included**: If `prisma/schema.prisma` was modified, ensure a corresponding migration file is present in `prisma/migrations/`.
- [ ] **No Destructive Operations**: Ensure migrations do not drop active columns without a safe transition plan.
- [ ] **Connection & Client Usage**: Ensure database operations import the singleton Prisma client from `@/lib/prisma` rather than instantiating new `PrismaClient()` instances.

### 3. AI & Gemini API Handling
- [ ] **Graceful Failure**: If the Gemini API fails, times out, or hits rate limits, does the UI show a clear error toast/message instead of freezing?
- [ ] **Credit Accounting**: Ensure note generation operations properly increment user credits or check limits via `lib/usage/`.
- [ ] **Prompt Integrity**: Ensure system instructions strictly enforce signal preservation, anti-hallucination, and clean Markdown formatting.

### 4. Next.js 16 & React 19 Patterns
- [ ] **Server vs. Client Components**: Components should be Server Components by default. Only files needing hooks (`useState`, `useEffect`, `useSyncExternalStore`), DOM events, or browser APIs should have `"use client"`.
- [ ] **Async Dynamic Route Params**: In Next.js 16, page and route parameters (`params` and `searchParams`) are asynchronous Promises. Verify they are awaited:
  ```typescript
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // ...
  }
  ```
- [ ] **Zero `any`**: Ensure TypeScript types are explicitly defined.

### 5. UI, Responsiveness & Theming
- [ ] **Dark & Light Modes**: Test UI in both themes. Ensure text is readable and contrasts meet accessibility standards. Use semantic tokens like `bg-card`, `text-muted-foreground`, etc.
- [ ] **Mobile & Tablet**: Test responsive layouts on mobile screen sizes (`< 640px`). Buttons and modals should not overflow or break viewport boundaries.
- [ ] **Loading & Empty States**: Look for clean skeleton loaders, spinners, or empty state illustrations when data is fetching or empty.

---

## Testing Pull Requests Locally

You can test any contributor's pull request on your machine with either the GitHub CLI (`gh`) or standard Git:

### Method A: Using GitHub CLI (Recommended)

```bash
# Checkout the PR directly (replaces <PR_NUMBER> with the PR number, e.g. 15)
gh pr checkout 15

# Install dependencies if package.json changed
npm install

# Run database migrations if schema changed
npx prisma generate
npx prisma migrate deploy

# Start local server
npm run dev
```

### Method B: Using Standard Git

```bash
# Fetch the PR branch into a local branch called pr-<PR_NUMBER>
git fetch origin pull/15/head:pr-15

# Switch to that branch
git checkout pr-15

# Test the app
npm run dev
```

### Cleaning Up After Testing

```bash
# Return to main branch
git checkout main

# Delete the temporary local PR branch
git branch -D pr-15
```

---

## Communication & Feedback Templates

### 1. Requesting Changes on Lint / CI Failure
> *"Hey @username, thanks so much for putting this together! It looks like the automated CI build failed on the lint check. You can run `npm run lint` and `npx tsc --noEmit` locally to reproduce and fix it. Let me know once updated and I'll review right away!"*

### 2. Suggesting an Architectural or Typing Improvement
> *"Nice implementation! For better type safety and to avoid `any`, what do you think about typing this using our existing `NoteWithFolder` type from `@/types`? Here is a quick suggestion:"*

### 3. Approving with Minor Nits
> *"Looks fantastic! Left one small non-blocking nit regarding class names, but otherwise this is good to go. Merging now, thank you for contributing to ClearNotes! 🚀"*

### 4. Politely Declining an Out-of-Scope Feature
> *"Thank you for the effort you put into this PR! After reviewing our current roadmap, we're focusing on core document parsing and note accuracy rather than adding [X] right now. I'm going to close this PR for now, but we'd love your help on issues tagged [`help wanted`](https://github.com/Mebaww/ClearNotes/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)!"*

---

## Merging Strategy

1. **Squash and Merge**: Use **Squash and Merge** as the default strategy on GitHub.
   - It condenses all iterative commits ("fix typo", "fix lint") into a single, clean commit on `main`.
2. **Commit Message Format**:
   - Write a clear squash commit title following Conventional Commits, for example:
     `feat: add folder color tagging support (#15)`
   - Include a concise summary in the commit body and credit the contributor (`Co-authored-by: @username`).
3. **Delete Branch**: Delete the feature branch after merging to keep the repository clean.
