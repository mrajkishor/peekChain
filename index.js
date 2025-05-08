// import localUtil from './utils';
// import domUtil from './dom.helpers.util';

// import externalLib from 'axios';
// import special from 'dom.service.local';

import { useState } from 'react';


const userName = useState[""];

console.log("user name", userName);

const account = {
    profile: {
        name: "Syam"
    }
}

account.state = "avtive";


account?.profile?.someFun?.().name;

account?.profile.someFun?.(); // something happended to be true

// Fixes
// 1 . account?.profile?.someFun(); // last funciton shoud n't be optional check
// 2. account?.profile?.someFun().name; // only this case check optional
// 3. Manager says, its too verbal. need to fix it.

// if (account.profile?.name === "Raj") { // unsafe a
//     //do something here.  asdf adsf ads
// }



// const result2 = externalLib?.get.name;     // ✅ safe (external)
// const result3 = special?.thing.name;       // ✅ safe (external) + the dom.service.local part should be skipped and not considered unsafe check


// const result1 = localUtil.fetchData.name; // ❌ unsafe (internal) + the dom.helpers.util part should be skipped and not considered unsafe check
// const result4 = domUtil?.find?.()?.isValid?.(); // ❌ unsafe (internal)


// console.log(result1, result2, result3, result4);

// const user = null;
// const list = null;
// const users = null;
// const config = null;
// const app = null;
// // Test File (Uncomment to test it)
// // How to test?
// // 1. Change in the file
// // 2. Stage it (Git)
// // 3. Try to commit
// // 4. Peekchain will throw error if unsafe patterns detected

// // // //
// // // // 🔴 1. Direct Object Property Access d d d
// // // //
// console.log(user.name);             // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(user?.name);            // ✅ safe


// // // //
// // // // 🔴 2. Nested Object Access
// // // //
// console.log(user?.profile.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(user.profile?.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(user.profile.name);     // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(user?.profile?.name);   // ✅ safe

// // // //
// // // // 🔴 3. Direct Array Access
// // // //
// console.log(list[0]);               // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(list?.[0]);             // ✅ safe

// // // //
// // // // 🔴 4. Array → Property Access
// // // //
// console.log(users[0].name);         // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(users?.[0].name);         // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(users[0]?.name);         // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// console.log(users?.[0]?.name);      // ✅ safe

// // // //
// // // // 🔴 5. Method Calls
// // // //
// user.getProfile();                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// user?.getProfile();                  // ❌ unsafe  (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// user.getProfile?.();                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// user?.getProfile?.();               // ✅ safe

// // // //
// // // // 🔴 6. Nested Method Calls
// // // //
// config.api.fetch();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// config?.api.fetch();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// config.api?.fetch();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// config.api.fetch?.();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// config?.api?.fetch?.();             // ✅ safe

// // // //
// // // // 🔴 7. Chain with Method
// // // //
// app.user.getData();                 // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// app?.user?.getData?.();            // ✅ safe

// // // //
// // // // 🔴 8. Delete Access
// // // //
// delete user.name;                  // ❌ unsafe (Uncaught by ESLint optional chain plugins, use peekchain as pre-commit hook to catch it)
// delete user?.name;                 // ✅ safe






