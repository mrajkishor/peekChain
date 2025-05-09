// 🧪 Inline fs mock for Dashboard.jsx
jest.mock('fs', () => {
    const actualFs = jest.requireActual('fs');
    return {
        ...actualFs,
        existsSync: jest.fn((path) => path.includes('mockfile-dashboard')),
        readFileSync: jest.fn(() => `
            import React, { useMemo } from 'react';
            const Dashboard = ({ config }) => {
              const theme = config?.settings?.theme ?? 'Default Theme';
              return <h1>Theme: {theme}</h1>;
            };
            export default Dashboard;
        `),
        writeFileSync: jest.fn(),
        appendFileSync: jest.fn(),
        mkdirSync: jest.fn()
    };
});

describe('Functional Dashboard.jsx Test', () => {
    let processExitMock; let consoleErrorMock;

    beforeEach(() => {
        process.env.NODE_ENV = 'test';
        jest.resetModules();
        processExitMock = jest.spyOn(process, 'exit').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should complete without reporting any unsafe patterns', () => {
        process.argv = ['node', 'checkOptionalChaining.js', './mockfile-dashboard.js'];
        const { runOptionalChainingCheck } = require('../lib/check.js');
        runOptionalChainingCheck();

        expect(processExitMock).not.toHaveBeenCalledWith(1); // no error
        // ✅ Allow harmless logs, fail only if real violations like "❌" or "🔥" are printed
        const errorMessages = consoleErrorMock.mock.calls.map(call => call.join(' '));
        const realErrors = errorMessages.filter(msg => /^❌|^🔥/.test(msg));
        expect(realErrors.length).toBe(0);

    });
});
