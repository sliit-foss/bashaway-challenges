const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython, isStrongPassword } = require('@sliit-foss/bashaway');

jest.setTimeout(10000)

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the password is validated properly', async () => {
    for (const _ of Array(25).keys()) {
        const randomPassword = faker.internet.password({ length: faker.number.int({ min: 1, max: 15 }), pattern: /[\dA-Za-z]/ });
        const valid = await exec(`bash execute.sh \'${randomPassword}\'`);
        expect(valid?.trim()).toBe((!!isStrongPassword(randomPassword)).toString());
    }
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
        expect(script).not.toContain("@sliit-foss")
        expect(script).not.toContain("bashaway")
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});