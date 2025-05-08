// 🧪 Inline fs mock for misuse case
jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) => path.includes('mockfile-misuse')),
        readFileSync: jest.fn(() => `
        const user = { name: 'Raj' };
        user?.name = "John";      // ❌ invalid assignment
        ++user?.count;            // ❌ invalid increment
        user?.likes++;            // ❌ invalid post-increment
      `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn(),
    };
});

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

describe('Misuse Optional Chaining Test', () => {
    it('should detect misuse patterns like assignment or increment on optional chaining', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-misuse.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');

        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');

        const joined = errorLogs.join('\n');
        const misuseCount = (joined.match(/optional-chaining-misuse/g) || []).length;
        expect(misuseCount).toBe(1);
    });
});
