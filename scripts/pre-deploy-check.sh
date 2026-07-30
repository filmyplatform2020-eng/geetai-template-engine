#!/bin/bash
# GeetAI Studio — Pre-Deploy Validation Hook
set -euo pipefail

REPO_DIR="/Users/aniket/Desktop/geetai-template-engine"
cd "$REPO_DIR"

echo "=== Pre-Deploy Validation ==="
echo ""

# 1. Git status
echo "[1/5] Checking git status..."
STATUS=$(git status --porcelain)
if [ -n "$STATUS" ]; then
  echo "  UNCOMMITTED CHANGES:"
  echo "$STATUS"
  echo ""
  echo "  Commit or stash before deploying."
  exit 1
fi
echo "  ✓ Clean working tree"
echo ""

# 2. Branch check
echo "[2/5] Checking branch..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "  ⚠ On branch '$BRANCH' — not main."
  echo "  Merge to main before deploying."
  exit 1
fi
echo "  ✓ On main branch"
echo ""

# 3. Sync with remote
echo "[3/5] Checking remote sync..."
git fetch origin main 2>/dev/null
BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
AHEAD=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)
if [ "$BEHIND" -gt 0 ]; then
  echo "  ⚠ Local is $BEHIND commit(s) behind origin. Pull first."
  exit 1
fi
echo "  ✓ In sync with origin ($AHEAD ahead)"
echo ""

# 4. Check for secrets
echo "[4/5] Scanning for secrets..."
SECRETS=$(git grep -n -E '(ghp_|gho_|sk-|AKIA|-----BEGIN\s+(RSA|EC|DSA|OPENSSH)\s+PRIVATE\s+KEY-----)' -- ':!*.md' ':!scripts/' 2>/dev/null || true)
if [ -n "$SECRETS" ]; then
  echo "  ⚠ Possible secrets found:"
  echo "$SECRETS"
  exit 1
fi
echo "  ✓ No secrets detected"
echo ""

# 5. Project structure
echo "[5/5] Validating project structure..."
[ -d "src" ] && echo "  ✓ src/"
[ -f "package.json" ] && echo "  ✓ package.json"
[ -d "public/images" ] && echo "  ✓ public/images/"
echo ""

echo "=== ALL CHECKS PASSED — Ready to deploy ==="
