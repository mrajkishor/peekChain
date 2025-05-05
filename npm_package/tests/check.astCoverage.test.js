jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => `
      function processUser() {
        return "Safe";
      }
  
      class UserProfile {
        constructor() {}
      }
  
      const user = { name: 'Raj', age: 30 };
      const { name, age } = user; // ✅ Safe destructuring
  
      const data = { a: 1 };
      console.log(data?.a);       // ✅ Safe optional chaining
    `
}));


jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'error').mockImplementation(() => { });

describe('AST Node Coverage Test', () => {
    it('should cover FunctionDeclaration, ClassDeclaration, and ObjectPattern destructuring in VariableDeclarator', () => {
        process.argv = ['node', 'check.js', './mockfile-all.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});
