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
    test('the script should be less than 100 characters in length', () => {
        expect(script.length).toBeLessThan(100);
    });
});

test('should check if the files are merged correctly', async () => {
    const json1 = {};
    const json2 = {};
    for (let i = 0; i < faker.number.int({ min: 100, max: 200 }); i++) {
        json1[faker.word.noun()] = faker.word.noun();
        json2[faker.word.noun()] = faker.word.noun();
    }
    fs.writeFileSync('./src/joint_data.json', JSON.stringify(json1, null, 2));
    fs.writeFileSync('./src/seam_specs.json', JSON.stringify(json2, null, 2));
    if (fs.existsSync('./out')) fs.rmdirSync('./out', { recursive: true });
    await exec('bash execute.sh');
    const merged = fs.readFileSync('./out/merged.json', 'utf-8');
    expect(JSON.parse(merged)).toMatchObject({ ...json1, ...json2 });
});