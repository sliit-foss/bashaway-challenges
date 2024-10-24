const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

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
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 40 characters in length', () => {
        expect(script.length).toBeLessThan(40);
    });
});

test('should check for correct output', async () => {
    const fileSize = faker.number.int({ min: 100, max: 1000000 });
    const fileContent = faker.string.sample(fileSize);
    fs.writeFileSync(`./src/phantom.o`, fileContent);
    const size = await exec('bash execute.sh');
    const actialSize = fs.statSync(`./src/phantom.o`).size;
    expect(Number(size.trim())).toBe(actialSize * 8);
});