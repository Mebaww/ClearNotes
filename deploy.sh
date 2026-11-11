#!/bin/bash
set -euo pipefail

COMPOSE="docker compose -f compose.yaml -f compose.db.yaml"

echo "🚀 Starting Docker Staging Deployment..."

# 1. Fetch latest changes
git fetch origin staging
git reset --hard origin/staging

if [ ! -f .env ]; then
  echo "❌ .env is missing on this host. Create it before deploying."
  exit 1
fi

# 2. Build the runtime and migration images
$COMPOSE --profile tools build

# 3. Apply database migrations (one-shot container)
$COMPOSE --profile tools run --rm migrate

# 4. Start/refresh the stack and wait until it is healthy
$COMPOSE up -d --wait --remove-orphans

# 5. Reclaim space from the previous image versions
docker image prune -f >/dev/null

echo "✅ Staging Deployment Successful!"
