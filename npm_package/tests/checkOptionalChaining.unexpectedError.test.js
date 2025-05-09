const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(() => { throw new Error('Mock failure'); }),
    };
});

describe('Unexpected error handling', () => {
    beforeEach(() => {

        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });

    });
    it('should catch and log unexpected exceptions', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-unexpected.js'];
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');  // t
    });
});