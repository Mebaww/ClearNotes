# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Base: shared Node runtime for every stage
# ---------------------------------------------------------------------------
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------------------
# tools: build/migrate stages need the openssl CLI so Prisma can detect the
#        correct schema-engine binary. The runtime image stays slim.
# ---------------------------------------------------------------------------
FROM base AS tools

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------------------------
# deps: install node_modules from the lockfile only (best layer caching)
# ---------------------------------------------------------------------------
FROM tools AS deps

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------------------------------------------------------------------------
# builder: generate Prisma client and build Next.js (standalone output)
# ---------------------------------------------------------------------------
FROM tools AS builder

COPY --from=deps /app/node_modules ./node_modules

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be passed as build args (not runtime env vars).
ARG NEXT_PUBLIC_APP_URL=http://localhost:3000
ARG NEXT_PUBLIC_GA_ID=

ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}

# Build-only placeholders. They are never used at runtime and are overridden
# by the real values when the container starts. They exist because module
# scope code (lib/prisma.ts, lib/env.ts, app/layout.tsx) runs during
# `next build` and would throw on missing values.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build
ENV BETTER_AUTH_SECRET=build-only-secret-at-least-32-characters-long
ENV BETTER_AUTH_URL=http://localhost:3000
ENV GOOGLE_CLIENT_ID=build-placeholder
ENV GOOGLE_CLIENT_SECRET=build-placeholder
ENV GEMINI_API_KEY=build-placeholder

# Generate the Prisma client before the full source copy so schema edits only
# invalidate this layer (prisma/generated is excluded via .dockerignore).
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY prisma.config.ts ./

RUN --mount=type=cache,target=/root/.npm \
    npx prisma generate

COPY . .

RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

# ---------------------------------------------------------------------------
# migrator: one-shot image that carries the Prisma CLI, schema and migrations
#           Usage: docker run --rm --env-file .env <image> [cmd]
#           (Needs the full node_modules, so it is not part of the runtime.)
# ---------------------------------------------------------------------------
FROM deps AS migrator

COPY prisma ./prisma
COPY prisma.config.ts ./

CMD ["npx", "prisma", "migrate", "deploy"]

# ---------------------------------------------------------------------------
# runner: minimal production image (Next.js standalone server)
# ---------------------------------------------------------------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Create an unprivileged application user
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

# Standalone output already contains the traced node_modules, server.js,
# and next.config. static/ and public/ are not copied by default.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma 7's generated client lives outside node_modules. Output tracing
# usually keeps it, this copy makes it deterministic.
COPY --from=builder --chown=nextjs:nodejs /app/prisma/generated ./prisma/generated

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
