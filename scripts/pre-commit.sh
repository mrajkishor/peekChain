#!/bin/sh

echo "🔍 Running ESLint..."

FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx)$')

if [ -z "$FILES" ]; then
  echo "✅ No JS files to lint."
  exit 0
fi

echo "$FILES" | xargs npx eslint || exit 1

echo "🔍 Running Peekchain..."
echo "$FILES" | xargs -n 1 npx peekchain || exit 1

echo "✅ All checks passed"
