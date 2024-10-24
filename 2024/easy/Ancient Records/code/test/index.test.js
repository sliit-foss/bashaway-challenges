const fs = require('fs');
const gunzip = require('gunzip-file');
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
        await expect(dependencyCount()).resolves.toStrictEqual(5)
    });
    test('the script should be less than 75 characters in length', () => {
        expect(script.length).toBeLessThan(75);
    });
});

test('should have gzipped the file properly', async () => {
    const filename = faker.system.fileName();
    const content = faker.string.uuid();
    if (fs.existsSync("./src")) fs.rmdirSync('./src', { recursive: true });
    if (fs.existsSync("./out")) fs.rmdirSync('./out', { recursive: true });
    fs.mkdirSync('./src', { recursive: true });
    fs.writeFileSync(`./src/${filename}`, content);
    await exec(`bash execute.sh`);
    const nameWithoutExtension = filename.split('.')[0];
    expect(fs.existsSync(`./out/${nameWithoutExtension}.gz`)).toBe(true);
    expect(fs.existsSync(`./out/${nameWithoutExtension}-unzipped.${filename.split('.')[1]}`)).toBe(false);
    await new Promise((resolve) => {
        gunzip(`./out/${nameWithoutExtension}.gz`, `./out/${nameWithoutExtension}-unzipped.${filename.split('.')[1]}`, resolve)
    });
    expect(fs.readFileSync(`./out/${nameWithoutExtension}-unzipped.${filename.split('.')[1]}`, 'utf-8')).toBe(content);
});