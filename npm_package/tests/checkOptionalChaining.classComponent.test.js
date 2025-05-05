// 🧪 Inline fs mock for Class Component UserProfile.jsx
jest.mock('fs', () => {
  const actualFs = jest.requireActual('fs');
  return {
    ...actualFs,
    existsSync: jest.fn((path) => path.includes('mockfile-class')),
    readFileSync: jest.fn(() => `
        import React, { Component } from "react";
        class UserProfile extends Component {
          render() {
            const { user } = this.props;
            return (
              <div>
                <h1>{user.name}</h1>
                <button onClick={() => user?.logOut?.()}>Safe Logout</button>
              </div>
            );
          }
        }
        export default UserProfile;
      `),
  };
});

// 🛑 Inline mocks for process/console
jest.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`ProcessExit_${code}`);
});
jest.spyOn(console, 'log').mockImplementation(() => { });
jest.spyOn(console, 'error').mockImplementation(() => { });
jest.spyOn(console, 'warn').mockImplementation(() => { });
jest.spyOn(console, 'info').mockImplementation(() => { });

describe('Class UserProfile.jsx Test', () => {
  it('should exit 1 for unsafe class UserProfile', () => {
    process.argv = ['node', 'checkOptionalChaining.js', './mockfile-class.js'];
    const { runOptionalChainingCheck } = require('../lib/check.js');
    expect(() => runOptionalChainingCheck()).toThrow('ProcessExit_1');
  });
});
