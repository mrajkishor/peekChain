jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'log').mockImplementation(() => { });
jest.spyOn(console, 'error').mockImplementation(() => { });

it('should exit with 0 when no file path is provided', () => {
    process.argv = ['node', 'check.js'];
    const { runOptionalChainingCheck } = require('../lib/check.js');
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_0');
});