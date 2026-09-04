# Contributing to ClearNotes

Thank you for your interest in contributing to ClearNotes! We welcome contributions from developers of all skill levels.

---

## Code of Conduct

Please review and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions within this project.

---

## Development Setup

### Prerequisites

- **Node.js** 20.x or later
- **npm** 10.x or later
- **PostgreSQL** database instance (local or hosted via Supabase, Neon, etc.)
- **Google Cloud Console account** (for Google OAuth credentials)
- **Google AI Studio account** (for a Gemini API key)

### Getting Started

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/<your-username>/ClearNotes.git
   cd ClearNotes
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   ```bash
   cp .env.example .env
   ```

   Open `.env` and configure:
   - `DATABASE_URL`: PostgreSQL connection string.
   - `BETTER_AUTH_SECRET`: Random 32-character secret (`openssl rand -base64 32`).
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials configured with redirect URI:
     `http://localhost:3000/api/auth/callback/google`
   - `GEMINI_API_KEY`: API key from Google AI Studio.

4. **Initialize Database**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Development Guidelines

### Code Quality & Standards

- **TypeScript**: Strive for strict typing. Avoid `any`; use generics or proper interfaces instead.
- **Linting**: Run `npm run lint` before committing. Ensure there are zero errors and zero warnings.
- **Clean Code & Comments**:
  - Write self-explanatory code with descriptive variable and function names.
  - Avoid redundant comments that simply rephrase the code.
  - Document complex algorithms, security requirements, and public interfaces with concise TSDoc/JSDoc.
- **Components**: Keep components focused, accessible, and responsive across mobile, tablet, and desktop screens.

### Pre-Commit Checklist

Before opening a pull request, please make sure:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint check
npm run lint

# 3. Production build test
npm run build
```

---

## Submitting Pull Requests

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit your changes with clear, descriptive commit messages.
3. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request against `main` on the ClearNotes repository with a description of what changed and why.

---

## Reporting Issues

If you encounter bugs or have feature ideas, please open an issue using the appropriate template:
- **Bug Report**: Include reproduction steps, environment details, and expected behavior.
- **Feature Request**: Explain the user problem and proposed solution.
