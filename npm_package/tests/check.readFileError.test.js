jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => { throw new Error('Boom'); }
}));
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'error').mockImplementation(() => { });

it('should exit 1 if readFileSync throws error', () => {
    process.argv = ['node', 'check.js', './mockfile.js'];
    const { runOptionalChainingCheck } = require('../lib/check.js');
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
});