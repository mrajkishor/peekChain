const { runOptionalChainingCheck } = require('../lib/check.js');

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



describe('Destructure fallback test', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });
    });
    it('should detect destructuring from null/undefined', () => {  // t
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-destructure.js'];
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});