# 🔍 Peekchain

![npm](https://img.shields.io/npm/v/peekchain?color=blue)  
🔒 **Catch unsafe optional chaining before it ships** — supports **CJS & ESM**, powered by Babel.

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
- ❌ `++user?.count` → invalid prefix increment  
- ❌ `user?.likes++` → invalid postfix increment  
- ❌ `function f({user}) {}` → destructuring tracked  
- ❌ `class A {}` → class declarations scanned  
- ❌ `const {name} = user ?? {}` → safe fallback destructuring supported  
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

## 🧪 Tested Coverage (100%)

Peekchain now has full test coverage including:

- ✔️ CLI entry point via `require.main === module`
- ✔️ Misuse patterns like assignments & increments on optional chains
- ✔️ Deep AST constructs (functions, classes, destructuring)
- ✔️ Integration tested via `jest`, `fs`, `child_process`, mocks

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
- ✅ Supports analyzing JavaScript written in ES Modules (ESM)

---

## 📝 Changelog

## 📝 Changelog

### v1.0.5 (October 2025)

- 🧾 All logs now written to `logs/peekchain.log`
- 🧹 Log file is cleared before each run
- 🖥️ Console shows `PASS` or `FAIL` with absolute log file path


---

## 📄 License

MIT © Rajkishor (mrajkishor331@gmail.com)