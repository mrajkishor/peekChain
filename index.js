import externalLib from 'axios';
import special from 'dom.service.local';
import localUtil from './utils';

const result1 = localUtil.fetchData.name; // ❌ unsafe
const result2 = externalLib?.get.name;     // ✅ safe
const result3 = special?.thing.name;       // ❌ should be skipped adsf

console.log(result1, result2, result3); // test asd

const user = null;
const list = null;
const users = null;
const config = null;
const app = null;

console.log(user.name);             // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)

console.log(user.profile.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)

console.log(list[0]);               // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)

console.log(users[0].name);         // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
user.getProfile?.();                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)

config.api.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)



