const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');
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
    test('the script should be less than 75 characters in length', () => {
        expect(script.length).toBeLessThan(75);
    });
});

test('should format and log the input string as required', async () => {
    for (let i = 0; i < 50; i++) {
        const inputStr = faker.lorem.words({ min: 500, max: 3000 });
        const n = faker.number.int({ min: 1, max: 100 });
        const output = await exec(`bash execute.sh "${inputStr}" ${n}`);
        let expected = inputStr.length / n;
        if (inputStr.length % n !== 0) expected++;
        expect(output?.split('\n')?.length - 1).toBe(Math.floor(expected));
    }
});