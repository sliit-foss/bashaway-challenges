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
        expect(script).not.toContain('encodeURI');
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check if the given string is encoded properly', async () => {
    const generateString = (length) => {
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        let result = '';
        for (let i = 0; i < length; i++) {
            if (Math.random() > 0.7) {
                result += specialChars.charAt(Math.floor(Math.random() * specialChars.length));
            } else {
                result += faker.string.alphanumeric(1);
            }
        }
        return result;
    }
    for (let i = 0; i < 10; i++) {
        const randomString = generateString(faker.number.int({ min: 500, max: 1000 }));
        const result = await exec(`bash execute.sh ${randomString}`);
        expect(result?.trim()).toBe(encodeURIComponent(randomString));
    }
});