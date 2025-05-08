// ✅ TEST: Direct call on local variable without optional chaining

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => `
      // This line should trigger the uncovered error logs
      const localUtil = { fetch: () => {} };
      localUtil.fetch(); // 🚫 Unsafe call without optional chaining
    `,
    appendFileSync: jest.fn()
}));

// 👇 Mock process and console for test observation
let errorLogs = [];
beforeEach(() => {
    errorLogs = [];
    jest.resetModules();
    jest.spyOn(console, 'log').mockImplementation((...args) => {
        errorLogs.push(args.join(' '));
    });
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        errorLogs.push(args.join(' '));
    });
    jest.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`ProcessExit_${code}`);
    });
});

describe('CallExpression unsafe function call on local identifier', () => {
    it('should trigger error log and exit with code 1', () => {
        process.argv = ['node', 'check.js', './mockfile-direct-call.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');

        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');

        const joined = errorLogs.join('\n');

        // ✅ Match new log format
        expect(joined).toMatch(/mockfile-direct-call\.js:\d+ error optional-chaining-unsafe-call/);
        expect(joined).toMatch(/'localUtil' function\/property call is not safely guarded/);
    });
});

