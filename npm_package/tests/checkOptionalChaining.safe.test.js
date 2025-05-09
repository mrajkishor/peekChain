const { runOptionalChainingCheck } = require('../lib/check.js');  // t

// Inline fs mock for this specific test file
jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) => path.includes('mockfile-safe.js')),
        readFileSync: jest.fn(() => `
          const user = { name: 'Raj' };
  console.log(user?.name);
  console.log(user?.profile?.name);
  console.log(list?.[0]?.title);
  user?.getProfile?.();
  delete user?.address;
  const { name } = user ?? {};
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

describe('Safe Code Test', () => {
    let processExitMock;
    let consoleErrorMock;

    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'info').mockImplementation(() => { });
        processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => { });
    });

    it('should complete safely without triggering errors or exit', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-safe.js'];
        runOptionalChainingCheck();

        expect(processExitMock).not.toHaveBeenCalled(); // ✅ no exit is fine too

        // ✅ Allow harmless logs; only fail if actual violations are reported
        const errorMessages = consoleErrorMock.mock.calls.map(args => args.join(' '));
        const realErrors = errorMessages.filter(msg => /^❌|^🔥/.test(msg));
        expect(realErrors.length).toBe(0);
    });

});
