
# 🔍 Peekchain

> A CLI tool that performs **deep AST-level validation of JavaScript optional chaining** for null safety — beyond what ESLint can catch.

---

## 🚀 What is Peekchain?

Optional chaining (e.g., `user?.profile?.name`) can **silently fail** or **crash** when misused (e.g., `user?.profile.name`). ESLint catches only some cases — `peekchain` fills the **critical safety gaps**.

---

## ✅ What it Detects

- ❌ `user?.profile.name` → unsafe access after optional chaining  
- ❌ `user?.profile().name` → unsafe function call return  
- ❌ `user?.[key].name` → key access not safely chained  
- ❌ `user?.name = "x"` → invalid assignment  
- ❌ `delete user?.profile.name` → unsafe delete  
- ✅ `user?.profile?.name` → safe

---

## 📦 Installation

```bash
npm install -g peekchain
```

---

## 🧪 Usage

```bash
peekchain path/to/your/file.js
```

Example:
```bash
peekchain index.js
```

---

## 🛠️ Recommended Pre-commit Hook

Create `.husky/pre-commit` and add:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx eslint . --max-warnings=0 || exit 1

FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.js$')
for FILE in $FILES; do
  peekchain "$FILE" || exit 1
done
```

---

## 📊 Why Use This?

- ESLint doesn’t catch nested `user?.profile.name` as unsafe  
- Peekchain does full AST parsing, walking the member chain safely  
- Ensures all intermediate accesses are **safely guarded**

---

## 📦 Local Development

```bash
git clone https://github.com/mrajkishor/peekChain.git
cd peekchain
npm install
node lib/check.js yourfile.js
```

---

## 🧠 Tech Stack

- [@babel/parser](https://babel.dev/docs/babel-parser)
- [@babel/traverse](https://babel.dev/docs/babel-traverse)
- Full ESM support

---

## 📄 License

MIT © Raj Kishor (mrajkishor331@gmail.com)


