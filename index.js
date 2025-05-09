
import externalLib from 'axios';
import special from 'dom.service.local';
import localUtil from './utils';


const result1 = localUtil?.fetchData?.name?.().type; // ✅ safe
const result15 = localUtil?.fetchData?.name; // ❌ unsafe d
const result2 = externalLib?.get.name;     // ✅ safe
const result3 = special?.thing.name;       // ❌ should be skipped adsf

console.log(result1, result2, result3, result15);

const user = null;
const list = null;
const users = null;
const config = null;
const app = null;
// Test File (Uncomment to test it)
// How to test?
// 1. Change in the file
// 2. Stage it (Git)
// 3. Try to commit 
// 4. Peekchain will throw error if unsafe patterns detected

// // //
// // // 🔴 1. Direct Object Property Access d d d
// // //
console.log(user?.name);             // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(user?.name);            // ✅ safe


console.log(user?.name?.getProfile?.().name.type); // safe
console.log(user?.name.profile); // safe

// // //
// // // 🔴 2. Nested Object Access
// // //
console.log(user?.profile?.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(user?.profile?.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(user?.profile?.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(user?.profile?.name);   // ✅ safe

// // //
// // // 🔴 3. Direct Array Access
// // //
console.log(list?.[0]);               // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(list?.[0]);             // ✅ safe

// // //
// // // 🔴 4. Array → Property Access
// // //
console.log(users?.[0]?.name);         // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(users?.[0]?.name);         // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(users?.[0]?.name);         // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log(users?.[0]?.name);      // ✅ safe

// // //
// // // 🔴 5. Method Calls
// // //
user?.getProfile?.();                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
user?.getProfile?.();                  // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
user?.getProfile?.();                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
user?.getProfile?.();               // ✅ safe

// // //
// // // 🔴 6. Nested Method Calls
// // //
config?.api?.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
config?.api?.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
config?.api?.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
config?.api?.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
config?.api?.fetch?.();             // ✅ safe

// // //
// // // 🔴 7. Chain with Method
// // //
app?.user?.getData?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
app?.user?.getData?.();            // ✅ safe

// // //
// // // 🔴 8. Delete Access
// // //
delete user?.name;                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
delete user?.name;                 // ✅ safe


// // //
// // // ❌ Misuse of Optional Chaining (invalid JavaScript)
// // // These should be caught by regex + AST
// // //


// // //
// // // 🔍 Advanced Patterns (require AST or ESLint)
// // //
const { name } = user ?? {};              // ❌ unsafe destructuring (needs AST to catch)  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
console.log("Name ", name)

// // // Suggested ESLint rules to catch advanced cases:
// // // "rules": {
// // //   "no-unsafe-optional-chaining": "error",
// // //   "no-optional-chaining-assign": "error"
// // // }



