jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-class-prop')),
        readFileSync: jest.fn(() => `
            class User {
                getProfile() { return { name: 'Raj' }; }
            }
            const user = new User();
            const name = user?.getProfile().name; // ❌ unsafe
        `),
    };
});

jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error('ProcessExit_' + code);
});

describe('Class property unsafe chaining', () => {
    it('should detect unsafe chaining from class instance', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-class-prop.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});