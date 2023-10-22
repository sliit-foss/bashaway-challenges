const fs = require('fs');
const os = require('os');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the system info is obtained and printed to the console', async () => {
    let output = await exec(`bash execute.sh`);
    expect(JSON.parse(output)).toEqual({
        cpu: os.cpus()[0].model,
        cores: os.cpus().length,
        memory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`,
        hostname: os.hostname(),
    })
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
        expect(script).not.toContain("const os = require('os')");
        expect(script).not.toContain("os.cpus()");
        expect(script).not.toContain("os.totalmem()");
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 300 characters in length', () => {
        expect(script.length).toBeLessThan(300);
    });
});