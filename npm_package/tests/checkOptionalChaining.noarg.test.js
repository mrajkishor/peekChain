// Inline mock: No file arg = no file check required, but we mock anyway
const { runOptionalChainingCheck } = require('../lib/check.js');


jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(() => ''),
    };
});



describe('No Argument Provided Test', () => {
    beforeEach(() => {
        // Inline process/console mocks
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });  // t
    });
    it('should exit 0 if no file argument provided', () => {
        process.argv = ['node', 'checkOptionalChaining.js']; // No file
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_0');
    });
});
