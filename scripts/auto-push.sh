#!/bin/bash
# Auto-push watcher: detects changes and pushes to origin/main every 60 seconds

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$REPO_DIR/scripts/auto-push.log"
BRANCH="main"
FEATURE_BRANCH="feature/landing-page-polish"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Auto-push watcher started ==="
log "Watching: $REPO_DIR"
log "Target branch: $BRANCH"

cd "$REPO_DIR" || exit 1

while true; do
  # Check for any uncommitted changes (modified, untracked, deleted)
  CHANGES=$(git status --porcelain)

  if [ -n "$CHANGES" ]; then
    log "Changes detected — staging and committing..."

    # Run tests first
    TEST_RESULT=$(node scripts/test-sync.js 2>&1)
    ERRORS=$(echo "$TEST_RESULT" | grep -c "Errors found:  0" || true)

    if echo "$TEST_RESULT" | grep -q "Errors found:  0"; then
      log "Tests passed ✓"

      # Stage all changes
      git add -A

      # Commit with timestamp
      COMMIT_MSG="chore(auto): sync changes $(date '+%Y-%m-%d %H:%M:%S')"
      git commit -m "$COMMIT_MSG"
      log "Committed: $COMMIT_MSG"

      # Ensure we're on main and merge feature branch if ahead
      CURRENT_BRANCH=$(git branch --show-current)
      if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
        git checkout "$BRANCH"
        git merge "$CURRENT_BRANCH" --no-ff -m "merge: auto-sync from $CURRENT_BRANCH"
        log "Merged $CURRENT_BRANCH → $BRANCH"
      fi

      # Push to both origin and srinija remotes
      git push origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
      log "Pushed to origin/$BRANCH ✓"
      git push srinija "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
      log "Pushed to srinija/$BRANCH ✓"
    else
      log "⚠ Tests failed — skipping push. Fix errors first."
      echo "$TEST_RESULT" >> "$LOG_FILE"
    fi
  else
    log "No changes detected."
  fi

  sleep 60
done
