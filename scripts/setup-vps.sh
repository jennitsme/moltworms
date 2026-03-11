#!/usr/bin/env bash
set -euo pipefail

# Usage: RUN AS NEW USER (non-root) after adding your SSH key and basic sudo.
# This script installs Node via nvm, Postgres, Redis, clones repo, installs deps,
# runs migrations+seed, and starts services via pm2 (dev mode).

# Config
REPO_URL="https://github.com/jennitsme/moltworms.git"
DB_URL="postgres://$USER@localhost:5432/moltworms"
REDIS_URL="redis://localhost:6379"
API_PORT=4000
WEB_PORT=3000
APP_DIR="$HOME/moltworms"

# Helpers
echo_step() { echo -e "\n[STEP] $*\n"; }

# 0) Prereqs: sudo must be available
if ! command -v sudo >/dev/null; then
  echo "sudo not found. Please ensure this user has sudo access." >&2
  exit 1
fi

# 1) Install base deps
echo_step "Installing base packages (git, curl, build-essential, postgresql, redis)"
sudo apt-get update -y
sudo apt-get install -y git curl build-essential postgresql redis-server
sudo systemctl enable postgresql redis-server
sudo systemctl start postgresql redis-server

# 2) Install Node via nvm
echo_step "Installing Node 20 via nvm"
if [ ! -d "$HOME/.nvm" ]; then
  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi
source "$HOME/.nvm/nvm.sh"
nvm install 20

# 3) Install pm2 globally
echo_step "Installing pm2"
npm install -g pm2

# 4) Setup Postgres user/db
echo_step "Ensuring Postgres user/db"
sudo -u postgres createuser -s "$USER" 2>/dev/null || true
sudo -u postgres createdb moltworms 2>/dev/null || true

# 5) Clone repo
echo_step "Cloning repo"
if [ ! -d "$APP_DIR" ]; then
  git clone "$REPO_URL" "$APP_DIR"
else
  echo "Repo already exists at $APP_DIR, pulling latest"
  (cd "$APP_DIR" && git pull)
fi
cd "$APP_DIR"

# 6) Install deps
echo_step "Installing npm deps"
npm ci

# 7) Env file
echo_step "Writing .env"
cat > .env <<EOF
POSTGRES_URL=$DB_URL
REDIS_URL=$REDIS_URL
PORT=$API_PORT
CORS_ORIGINS=http://localhost:$WEB_PORT
NEXT_PUBLIC_API_URL=http://localhost:$API_PORT
# TELEGRAM_BOT_TOKEN=
EOF

# 8) Migrate + seed
echo_step "Running prisma migrate + seed"
npx prisma migrate deploy --schema services/api/prisma/schema.prisma
npx prisma db seed --schema services/api/prisma/schema.prisma

# 9) Start services (dev mode)
echo_step "Starting services with pm2 (dev mode)"
pm2 delete api worker web >/dev/null 2>&1 || true
pm2 start "PORT=$API_PORT POSTGRES_URL=$DB_URL REDIS_URL=$REDIS_URL npm run dev:api" --name api
pm2 start "POSTGRES_URL=$DB_URL REDIS_URL=$REDIS_URL TELEGRAM_BOT_TOKEN= npm run dev:worker" --name worker
pm2 start "NEXT_PUBLIC_API_URL=http://localhost:$API_PORT npm run dev:web" --name web
pm2 save
pm2 status

echo_step "Done. Check API health: curl http://localhost:$API_PORT/health"
echo "Web on http://localhost:$WEB_PORT (if port open)."