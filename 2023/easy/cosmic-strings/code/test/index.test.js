const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should validate output against sample string', () => {
    test('racecar - should output 1', async () => {
        const result = await exec('bash execute.sh racecar');
        expect(result.trim()).toBe('1');
    });
    test('hello - should output 0', async () => {
        const result = await exec('bash execute.sh hello');
        expect(result.trim()).toBe('0');
    });
    test('bob - should output 1', async () => {
        const result = await exec('bash execute.sh bob');
        expect(result.trim()).toBe('1');
    });
    test('alice - should output 0', async () => {
        const result = await exec('bash execute.sh alice');
        expect(result.trim()).toBe('0');
    });
    test('level - should output 1', async () => {
        const result = await exec('bash execute.sh level');
        expect(result.trim()).toBe('1');
    });
    test('madam - should output 1', async () => {
        const result = await exec('bash execute.sh madam');
        expect(result.trim()).toBe('1');
    });
    test('rotor - should output 1', async () => {
        const result = await exec('bash execute.sh rotor');
        expect(result.trim()).toBe('1');
    });
    test('duck - should output 0', async () => {
        const result = await exec('bash execute.sh duck');
        expect(result.trim()).toBe('0');
    });
    test('mom - should output 1', async () => {
        const result = await exec('bash execute.sh mom');
        expect(result.trim()).toBe('1');
    });
    test('uncle - should output 0', async () => {
        const result = await exec('bash execute.sh uncle');
        expect(result.trim()).toBe('0');
    });
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 45 characters in length', () => {
        expect(script.length).toBeLessThan(45);
    });
});