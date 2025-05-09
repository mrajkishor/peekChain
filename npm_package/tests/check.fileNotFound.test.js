const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => false,
    writeFileSync: jest.fn(),
    appendFileSync: jest.fn(),
    mkdirSync: jest.fn()
}));
beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation((code) => {  // t
        throw new Error(`ProcessExit_${code}`);
    });
    jest.spyOn(console, 'error').mockImplementation(() => { });

});
it('should exit 0 if file does not exist', () => {

    process.argv = ['node', 'check.js', './nonexistent.js'];
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_0');
});