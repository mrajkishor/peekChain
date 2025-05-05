jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => false
}));
jest.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'error').mockImplementation(() => { });

it('should exit 0 if file does not exist', () => {
    process.argv = ['node', 'check.js', './nonexistent.js'];
    const { runOptionalChainingCheck } = require('../lib/check.js');
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_0');
});