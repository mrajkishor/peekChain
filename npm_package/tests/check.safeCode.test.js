
const { runOptionalChainingCheck } = require('../lib/check.js');

jest.mock('fs', () => ({
    ...jest.requireActual('fs'),
    existsSync: () => true,
    readFileSync: () => `
      const obj = { nested: { val: 5 } };
      console.log(obj?.nested?.val);
      const res = arr?.[0]?.value;
    `
}));
beforeEach(() => {
    jest.spyOn(process, 'exit').mockImplementation((code) => {
        throw new Error(`ProcessExit_${code}`);
    });
    jest.spyOn(console, 'error').mockImplementation(() => { });  // t

});
it('should not call process.exit with 1 for safe optional chaining', () => {
    process.argv = ['node', 'check.js', './mockfile-safe.js'];

    expect(() => runOptionalChainingCheck()).not.toThrow('ProcessExit_1');
});
