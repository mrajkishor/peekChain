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
    };
});

jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error('ProcessExit_' + code);
});

describe('Delete property test', () => {
    it('should detect unsafe delete usage', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-delete.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});