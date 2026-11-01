#!/bin/bash
set -e

echo "🚀 Starting Staging Deployment on VPS..."

# 1. Fetch latest changes from staging
git fetch origin staging
git reset --hard origin/staging

# 2. Install any new dependencies
npm install --prefer-offline --no-audit

# 3. Generate Prisma client & apply database migrations
npx prisma generate
npx prisma migrate deploy

# 4. Build the Next.js production bundle
npm run build

# 5. Reload PM2 with zero downtime
pm2 reload clearnotes --update-env

echo "✅ Staging Deployment Successful!"
