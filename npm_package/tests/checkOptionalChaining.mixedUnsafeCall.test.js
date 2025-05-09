jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-mixed-call')),
        readFileSync: jest.fn(() => `
            const user = { getProfile: () => ({ name: 'Raj' }) };
            const name = user.getProfile().name; // ❌ Unsafe chain: ?.() followed by .
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

const originalProcessExit = process.exit;



describe('Mixed unsafe optional call test', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${code}`);
        });
    });

    afterAll(() => {
        process.exit = originalProcessExit;
    });
    it('should detect mixed safe/unsafe chaining', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-mixed-call.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});
