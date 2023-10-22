const fs = require('fs/promises');
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the relic.txt file is read only', async () => {
    expect(fs.appendFile('./src/relic.txt', "abc")).rejects.toThrow();
    fs.appendFile('./src/relic.txt', "abc").catch((err) => {
        expect(['EPERM: operation not permitted, open', 'EACCES: permission denied, open'].find(m=> err.message.includes(m))).toBeTruthy();
    });
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(async () => {
        script = await fs.readFile('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(2)
        expect(script).not.toMatch(prohibitedCommands);
    });
});