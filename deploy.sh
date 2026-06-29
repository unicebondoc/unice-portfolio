#!/usr/bin/env bash
#
# deploy.sh — one-command deploy for unice-portfolio
# Commits all current changes and pushes to GitHub (Vercel auto-deploys).
#
# Usage:
#   ./deploy.sh                 → commits with an auto timestamp message
#   ./deploy.sh "your message"  → commits with your own message
#   npm run deploy              → same thing
#
set -euo pipefail

# Always run from the repo root (folder this script lives in)
cd "$(dirname "$0")"

# 1. Clear any stale git lock left by a crashed/cancelled git process
if [ -f .git/index.lock ]; then
  echo "🧹 Clearing stale .git/index.lock…"
  rm -f .git/index.lock
fi

# 2. Bail out early if there's nothing to deploy
if [ -z "$(git status --porcelain)" ]; then
  echo "✨ Nothing to commit — working tree is clean. Nothing to deploy."
  exit 0
fi

# 3. Commit message: first argument, or an auto timestamp
MSG="${1:-"Update site — $(date '+%Y-%m-%d %H:%M')"}"

echo "📦 Staging all changes…"
git add -A

echo "📝 Committing: $MSG"
git commit -m "$MSG"

echo "🚀 Pushing to GitHub (Vercel will auto-deploy)…"
git push

echo "✅ Done! Your changes are live in a minute or two."
