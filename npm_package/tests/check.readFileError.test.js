const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => { throw new Error('Boom'); }
}));
beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation((code) => {  // t
        throw new Error(`ProcessExit_${code}`);
    });
    jest.spyOn(console, 'error').mockImplementation(() => { });
});

it('should exit 1 if readFileSync throws error', () => {

    process.argv = ['node', 'check.js', './mockfile.js'];
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
});