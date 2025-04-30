
# 🛡️ PeekChain SafeGuard

[![npm version](https://img.shields.io/npm/v/peekchain.svg)](https://www.npmjs.com/package/peekchain)
[![npm downloads](https://img.shields.io/npm/dm/peekchain.svg)](https://www.npmjs.com/package/peekchain)

**peekchain** is a command-line tool and pre-commit hook that helps developers **prevent unsafe optional chaining usage** in JavaScript code — a case that standard ESLint often misses.

🔗 [View on npm »](https://www.npmjs.com/package/peekchain)

---

## 🚀 Features

- ✅ Detects unsafe access patterns like `user?.profile.name` or `user?.[key].value`
- ✅ Guards against misuse in assignments, delete, increment/decrement
- ✅ Easy integration as a pre-commit hook
- ✅ Complements ESLint rules with stricter protection
- ✅ Supports JSX, modern JS syntax, and dynamic access

---

## 📦 Installation

### 🔧 Global Installation (CLI available everywhere)

```bash
npm install -g peekchain
```

### 📁 Local Project Installation (for teams/projects)

```bash
npm install --save-dev peekchain
```

---

## 🧪 Usage

### CLI Mode

```bash
peekchain <yourfile.js>
```

#### Example

```bash
peekchain src/components/UserCard.js
```

If the file contains unsafe patterns, you’ll see a detailed error like:

```bash
❌ [Unsafe Access] src/UserCard.js:13
   ↪ user?.profile.name
   ⚠️ 'user' is optional but 'profile' is accessed without guarding
```

---

## 🔗 Pre-commit Hook (Recommended)

Prevent unsafe optional chaining from being committed.

### 1. Install Husky (if not already)

```bash
npx husky-init && npm install
```

### 2. Add peekchain to pre-commit hook

```bash
npx husky add .husky/pre-commit "npx peekchain"
```

Now every commit will be scanned and blocked if unsafe optional chaining is found ✅

---

## 📏 What It Catches

### ✅ Safe Code Examples

```js
user?.profile?.name;
user?.getName?.();
obj?.[key]?.value;
arr?.[0]?.length;
```

### ❌ Unsafe Code That Will Be Blocked

```js
user?.profile.name;         // unsafe
user?.getName().name;       // unsafe
user?.[key].value;          // unsafe
user?.name = 'Raj';         // unsafe
++user?.count;              // unsafe
delete user.name;           // unsafe
```

---

## 🎯 Why Use PeekChain (vs ESLint only)?

| 🔍 Case | ESLint | PeekChain |
|--------|--------|------------|
| Detects unsafe `user?.profile.name` | ❌ | ✅ |
| Handles `++`, `=`, `delete` with `?.` | ❌ | ✅ |
| AST-based validation | ⚠️ Partial | ✅ Deep |
| Works with JSX and dynamic access | ⚠️ Limited | ✅ Fully supported |
| Pre-commit blocking | ⚠️ Manual setup | ✅ Plug & Play |

---

## 🧠 Technical Details

- Uses Babel parser to convert your JS/JSX into AST.
- Walks and inspects AST for unsafe chaining patterns.
- Supports `.js`, `.jsx`, `.mjs`, `.cjs`.
- Optimized for ECMAScript 2023+ syntax.

---

## 🛠️ Local Dev & Testing

You can test locally by running:

```bash
npx peekchain yourfile.js
```

Or use directly:

```bash
node node_modules/peekchain/checkOptionalChaining.js yourfile.js
```

---

## 📚 License

MIT License — Use freely, contribute gladly.

---

💡 Built with ❤️ to catch what linters miss.

