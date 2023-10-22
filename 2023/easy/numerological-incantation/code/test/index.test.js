const fs = require('fs/promises');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(45000)

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the prime factors are obtained properly', async () => {
    for (let i = 0; i < 10; i++) {
        const number = faker.number.int({ min: 150, max: 500000 });
        const result = await exec(`bash execute.sh ${number}`);
        expect(result?.trim()?.split('x').reduce((a, b) => +a * +b, 1)).toBe(number);
    }
});

test('should check invokation with no arguments', async () => {
    const result = await exec('bash execute.sh');
    expect(result?.trim()).toStrictEqual('Please pass in a number as an argument to the script.');
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
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});