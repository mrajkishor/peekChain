
// 🔥 Inline fs mock for this test only
jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) => path.includes('mockfile-unsafe.js')),
        readFileSync: jest.fn(() => `
          const user = null;
  user?.name = "John";
  ++user?.count;
  delete user.name;
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

// 🔧 Inline process/console mocks
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'log').mockImplementation(() => { });
jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(console, 'warn').mockImplementation(() => { });
jest.spyOn(console, 'info').mockImplementation(() => { });

describe('Unsafe Chaining Test', () => {
    it('should exit 1 for unsafe chaining', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-unsafe.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
    });
});
