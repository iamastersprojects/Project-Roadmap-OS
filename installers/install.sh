#!/usr/bin/env sh
set -eu

TARGET="${1:?target directory required}"
NAME="${2:-Project Roadmap OS Workspace}"
STATE="${3:-new}"
IDE="${4:-generic}"
LANGUAGE="${5:-es}"

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

command -v node >/dev/null 2>&1 || {
  echo "Node.js 20+ is required." >&2
  exit 1
}

node "$REPO_ROOT/src/cli.mjs" init \
  --target "$TARGET" \
  --name "$NAME" \
  --state "$STATE" \
  --language "$LANGUAGE" \
  --ide "$IDE"

node "$REPO_ROOT/src/cli.mjs" doctor --target "$TARGET"
