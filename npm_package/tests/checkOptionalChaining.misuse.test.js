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
        mkdirSync: jest.fn()
    };
});

// 🛑 Inline mocks for process/console
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

    jest.spyOn(process, 'exit').mockImplementation(() => { });
});

describe('Misuse Optional Chaining Test', () => {
    it('should detect misuse patterns like assignment or increment on optional chaining', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-misuse.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');

        // Check for process exit
        runOptionalChainingCheck(); // ❌ no throw now

        const joined = errorLogs.join('\n');

        // ✅ Check for each misuse pattern reported
        expect(joined).toMatch(/user\?\.\w+\s*=\s*"John"/);      // assignment
        expect(joined).toMatch(/\+\+\s*user\?\.\w+/);            // prefix increment
        expect(joined).toMatch(/user\?\.\w+\s*\+\+/);            // postfix increment

    });
});
