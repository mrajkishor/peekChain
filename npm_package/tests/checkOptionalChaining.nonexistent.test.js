const { runOptionalChainingCheck } = require('../lib/check.js');

// Inline mock to simulate fs for a nonexistent file
jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) =>
            path && !path.includes('nonexistent.js') // nonexistent.js should return false
        ),
        readFileSync: jest.fn(() => ''), // won't be called but mock anyway
    };
});


describe('Nonexistent File Test', () => {
    beforeEach(() => {

        // Inline process/console mocks
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { }); // t
        jest.spyOn(console, 'info').mockImplementation(() => { });
    });
    it('should exit 0 for nonexistent file', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './nonexistent.js'];
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_0');
    });
});
