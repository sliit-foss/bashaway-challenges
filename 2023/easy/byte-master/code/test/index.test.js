const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, scanPure } = require('@sliit-foss/bashaway');

beforeAll(() => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    for (let i = 0; i < faker.number.int({ min: 10, max: 25 }); i++) {
        let fileName = null;
        while (!fileName || fileName.endsWith('.sh')) fileName = faker.system.fileName();
        const fileSize = faker.number.int({ min: 100, max: 1000000 });
        const fileContent = faker.string.sample(fileSize);
        fs.writeFileSync(`./src/${fileName}`, fileContent);
    }
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the file size is calculated properly', async () => {
    const files = scanPure('src/**');
    const actualTotalSize = files.reduce((acc, file) => {
        const stats = fs.statSync(file);
        return acc + stats.size;
    }, 0);
    expect(files.length).toBeGreaterThanOrEqual(10);
    let calculatedTotalSize = await exec(`bash execute.sh`)
    if (calculatedTotalSize) calculatedTotalSize = Number(calculatedTotalSize.trim());
    expect(calculatedTotalSize).toBe(actualTotalSize);
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
        expect(script).not.toContain("scanPure");
        expect(script).not.toContain("fs.statSync");
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});