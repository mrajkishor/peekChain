jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) => path.includes('mockfile.js')),
        readFileSync: jest.fn(() => `
  import localUtil from './utils';
  import domUtil from './dom.helpers.util';
  import externalLib from 'axios';
  import special from 'dom.service.local';

  const result2 = externalLib?.get.name;
  const result3 = special?.thing.name;

  const result1 = localUtil?.fetchData.name;
  const result4 = domUtil?.find().isValid();
`),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()

    };
});

describe('Import Safety Rules', () => {
    let errorLogs = [];

    beforeEach(() => {
        errorLogs = [];
        jest.resetModules();

        jest.spyOn(console, 'log').mockImplementation((...args) => {
            errorLogs.push(args.join(' '));
        });

        jest.spyOn(console, 'error').mockImplementation((...args) => {
            errorLogs.push(args.join(' '));
        });

        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`ProcessExit_${  code}`);
        });
    });

    it('should flag unsafe access on local import, skip external, and skip dom.service.local', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');

        let exitError = null;
        try {
            runOptionalChainingCheck();
        } catch (err) {
            exitError = err;
        }

        expect(exitError).toBeTruthy();
        expect(exitError.message).toBe('ProcessExit_1');

        const joined = errorLogs.join('\n');
        expect(joined).toMatch(/mockfile\.js:\d+ error optional-chaining-unsafe 'localUtil'/); // ⛔ should flag
        expect(joined).not.toMatch(/domUtil/);         // ✅ should skip
        expect(joined).not.toMatch(/externalLib/);     // ✅ should skip axios
        expect(joined).not.toMatch(/special/);         // ✅ should skip dom.service.local
    });

});
