jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn(path => path.includes('mockfile-class-prop')),
        readFileSync: jest.fn(() => `
  import user from './user.helper'; 
  const city = user.getProfile().address.city; 
      `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

let errorLogs = [];



describe('Class property unsafe chaining', () => {
    beforeEach(() => {
        errorLogs = [];
        jest.resetModules();

        jest.spyOn(console, 'log').mockImplementation((...args) => {
            errorLogs.push(args.join(' '));
        });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(process, 'exit').mockImplementation(code => {
            throw new Error(`ProcessExit_${code}`);
        });
    });
    it('should detect unsafe chaining from local import', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-class-prop.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');

        try {
            runOptionalChainingCheck();
        } catch (e) {
            expect(e.message).toBe('ProcessExit_1');
        }

        const logJoined = errorLogs.join('\n');
        expect(logJoined).toMatch(/mockfile-class-prop\.js:\d+/);
        expect(logJoined).toMatch(/'user' is local, but function\/property call chain is not safely guarded/);
    });
});
