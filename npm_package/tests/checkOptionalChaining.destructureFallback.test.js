jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-destructure')),
        readFileSync: jest.fn(() => `
            const maybeNull = null;
            const { name } = maybeNull; // ❌ unsafe
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error('ProcessExit_' + code);
});

describe('Destructure fallback test', () => {
    it('should detect destructuring from null/undefined', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-destructure.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});