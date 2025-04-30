#!/bin/sh

echo "🔍 Running ESLint..."
FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx)$')

if [ -z "$FILES" ]; then
  echo "✅ No JS files to lint."
  exit 0
fi

npx eslint $FILES || exit 1

echo "🔍 Running Peekchain..."
for FILE in $FILES; do
  npx peekchain "$FILE" || exit 1
done

echo "✅ All checks passed"
