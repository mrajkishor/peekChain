// tests/checkOptionalChaining.callSafetyOnly.test.js
const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-callsafety')),
        readFileSync: jest.fn(() => `
            import a from './a.helper'; // 👈 makes 'a' a local identifier
            a().get()?.nested?.().play.run(); // ❌ unsafe optional chain
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),  // t
        mkdirSync: jest.fn(),
    };
});

let errorLogs = [];

describe('CallExpression unsafe chain triggers checkOptionalChainSafety', () => {
    beforeEach(() => {
        errorLogs = [];
        jest.resetModules();
        jest.spyOn(console, 'log').mockImplementation((...args) => {
            errorLogs.push(args.join(' '));
        });
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });
    });

    it('should trigger checkOptionalChainSafety and report unsafe optional call', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-callsafety.js'];

        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');

        const joined = errorLogs.join('\n');
        expect(joined).toMatch(/Unsafe Optional Call/);
    });
});
