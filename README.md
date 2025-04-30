# 🛡️ PeekChain SafeGuard

**peekchain** is a command-line tool and pre-commit hook that helps developers **prevent unsafe optional chaining usage** in JavaScript code — a case that standard ESLint often misses.

---

## 🚀 Features

- ✅ Detects unsafe access patterns like `user?.profile.name` or `user?.[key].value`
- ✅ Guards against misuse in assignments, delete, increment/decrement
- ✅ Easy integration as a pre-commit hook
- ✅ Complements ESLint rules with stricter protection
- ✅ Supports JSX, modern JS syntax, and dynamic access

---

## 📦 Installation

### Global (CLI available system-wide)
```bash
npm install -g peekchain
```

### Local (as dev dependency for your project)
```bash
npm install --save-dev peekchain
```

---

## 🧪 Usage

### CLI
```bash
peekchain <file.js>
```

**Example:**
```bash
peekchain src/components/UserCard.js
```

If the file contains unsafe patterns, you’ll see an error like:
```bash
❌ [Unsafe Access] src/UserCard.js:13
   ↪ user?.profile.name
   ⚠️ 'user' is optional but 'profile' is accessed without guarding
```

---

## 🔗 Git Pre-commit Hook Integration (Optional)

Prevent bad patterns before code is committed.

### 1. Install Husky
```bash
npx husky-init && npm install
```

### 2. Add peekchain to pre-commit
```bash
npx husky add .husky/pre-commit "peekchain"
```

Now it will auto-run on every commit and block unsafe code!

---

## 📏 What It Catches (Examples)

### ✅ Safe Patterns
```js
user?.profile?.name;
user?.getName?.();
obj?.[key]?.value;
arr?.[0]?.length;
```

### ❌ Unsafe Patterns Detected
```js
user?.profile.name;          // unsafe
user?.getName().name;        // unsafe
user?.[key].value;           // unsafe
user?.name = 'Raj';          // unsafe
++user?.count;               // unsafe
delete user.name;            // unsafe
```

---

## 🎯 Why Use peekchain (vs ESLint alone)?

| ❓ What | ✅ ESLint | ✅ peekchain |
|--------|-----------|--------------|
| `user?.profile.name` detection | ❌ No | ✅ Yes |
| Handles `delete`, `++`, `=` | ❌ No | ✅ Yes |
| AST-level deep scan | ❌ Basic | ✅ Yes |
| Pre-commit ready | ⚠️ Needs setup | ✅ Plug-and-play |

---

## 🧠 Advanced Notes

- Internally uses Babel to parse code and walks the AST for static analysis.
- Currently supports `.js`, `.jsx`, `.mjs`, `.cjs`
- Supports latest ECMAScript and optional chaining syntax.

---

## 👨‍💻 Local Development

To run on your own file locally:

```bash
npx peekchain yourfile.js
```

---

## 📚 License

MIT License — Use freely, contribute gladly.