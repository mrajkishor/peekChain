import externalLib from 'axios';
import special from 'dom.service.local';
import localUtil from './utils';

const result1 = localUtil.fetchData.name;
const result2 = externalLib.get.name;
const result3 = special.thing.name;

console.log(result1, result2, result3);

const user = null; // test 3
const list = null;
const users = null;
const config = null;
console.log(user.name);
console.log(user.profile.name);
console.log(list[0]);
console.log(users[0].name);
user.getProfile?.();
config.api.fetch?.(); // test

