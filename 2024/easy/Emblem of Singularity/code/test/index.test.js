const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { validate } = require('uuid');
const { scan, shellFiles, dependencyCount, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
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
        await expect(dependencyCount()).resolves.toStrictEqual(4)
    });
    test('the script should be less than 10 characters in length', () => {
        expect(script.length).toBeLessThan(10);
    });
});

test('should check if a uuid is generated successfully', async () => {
    for (let i = 0; i < 10; i++) {
        const result = await exec(`bash execute.sh`);
        expect(validate(result?.trim())).toBe(true);
    }
});