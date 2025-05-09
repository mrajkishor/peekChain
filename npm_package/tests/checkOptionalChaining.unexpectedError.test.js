jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(() => true),
        readFileSync: jest.fn(() => { throw new Error('Mock failure'); }),
    };
});

jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${  code}`);
});

describe('Unexpected error handling', () => {
    it('should catch and log unexpected exceptions', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-unexpected.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});