const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

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
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check for correct output', async () => {
    for (let i = 0; i < faker.number.int({ min: 20, max: 30 }); i++) {
        const randomNumber = faker.number.int({ min: 1, max: 100 });
        const output = await exec(`bash execute.sh ${randomNumber}`);
        expect(output?.trim()).toBe(((randomNumber%2) === 0) ? 'Even' : 'Odd');
    }
});