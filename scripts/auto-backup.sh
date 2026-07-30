#!/bin/bash
# GeetAI Studio — Auto Backup Script
# Scheduled commit-and-push for GitHub version control
# See: GITHUB_BACKUP_REPORT.md for full policy

set -euo pipefail

REPO_DIR="/Users/aniket/Desktop/geetai-template-engine"
BRANCH="main"
LOG_FILE="$REPO_DIR/logs/backup.log"

mkdir -p "$REPO_DIR/logs"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR"

# 1. Fetch latest
log "Fetching origin..."
git fetch origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

# 2. Check for changes
if git diff --quiet && git diff --cached --quiet && [ -z "$(git status --porcelain)" ]; then
  log "No changes — skipping empty commit."
  exit 0
fi

# 3. Pre-push validation
log "Running pre-push validation..."

# Check for secrets
STAGED_SECRETS=$(git diff --cached -G '(?:ghp_|gho_|ghu_|ghs_|ghr_|sk-|pk-|AKIA|-----BEGIN)' --name-only || true)
if [ -n "$STAGED_SECRETS" ]; then
  log "WARNING: Potential secrets staged in: $STAGED_SECRETS"
  log "ABORTING push — review staged files first."
  exit 1
fi

# 4. Stage and commit
log "Staging changes..."
git add -A
git add --ignore-removal . 2>/dev/null || true

COMMIT_MSG="$(TZ='Asia/Kolkata' date '+%Y-%m-%d %H:%M') IST

chore: Auto-backup — $(git diff --cached --name-only | wc -l | tr -d ' ') files changed"

log "Committing..."
git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOG_FILE"

# 5. Push
log "Pushing to origin/$BRANCH..."
git push origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"

log "Backup complete."
