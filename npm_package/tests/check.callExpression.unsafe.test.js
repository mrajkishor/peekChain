const { runOptionalChainingCheck } = require('../lib/check.js');


jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => `
      // This line should trigger the uncovered error logs
      const localUtil = { fetch: () => {} };
      localUtil.fetch(); // Unsafe call without optional chaining
    `,
    appendFileSync: jest.fn()  // t
}));



describe('CallExpression unsafe function call on local identifier', () => {
    //  Mock process and console for test observation
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
    it('should trigger error log and exit with code 1', () => {
        process.argv = ['node', 'check.js', './mockfile-direct-call.js'];


        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');

        const joined = errorLogs.join('\n');

        // Match new log format
        expect(joined).toMatch(/mockfile-direct-call\.js:4/);
        expect(joined).toMatch(/Unsafe Call Access/);

    });
});

