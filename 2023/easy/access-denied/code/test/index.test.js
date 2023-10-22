const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles(["src/**"]).length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check if the script is executed properly', () => {
    beforeAll(() => {
        if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
        fs.mkdirSync('./src');
    });
    test('should execute the script', async () => {
        const randomNumber = faker.number.int({ min: 1, max: 200000 }).toString();
        const randomShellFilename = `${faker.system.fileName()}.sh`;
        fs.writeFileSync(`./src/${randomShellFilename}`, `echo ${randomNumber}`);
        const randomEnvKeys = [...Array(faker.number.int({ min: 8, max: 15 })).keys()].map(() => faker.lorem.word().toUpperCase());
        const result = await exec(`bash -c \"${randomEnvKeys.map((key) => `${key}=1`).join(" ")} bash execute.sh --keys=${randomEnvKeys.join(' ')} --script=./src/${randomShellFilename}\"`);
        expect(result?.trim()).toStrictEqual(randomNumber)
    });
    test('should not execute the script', async () => {
        const randomNumber = faker.number.int({ min: 1, max: 200000 });
        const randomShellFilename = `${faker.system.fileName()}.sh`;
        fs.writeFileSync(`./src/${randomShellFilename}`, `echo ${randomNumber}`);
        const randomEnvKeys = [...Array(faker.number.int({ min: 8, max: 15 })).keys()].map(() => faker.lorem.word().toUpperCase());
        const result = await exec(`bash -c \"${randomEnvKeys.slice(1).map((key) => `${key}=1`).join(" ")} bash execute.sh --keys=${randomEnvKeys.join(' ')} --script=./src/${randomShellFilename}\"`);
        expect(result?.trim()).toStrictEqual("Access Denied")

    });
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