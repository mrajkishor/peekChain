const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-delete')),
        readFileSync: jest.fn(() => `
            const user = { name: 'Raj' };
            delete user.name;        // ❌ unsafe
            delete user?.address;    // ✅ safe
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

describe('Delete property test', () => {
    beforeEach(() => {

        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });

    });
    it('should detect unsafe delete usage', () => {  // t
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-delete.js'];
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});