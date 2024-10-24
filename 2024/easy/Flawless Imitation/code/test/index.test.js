const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');
const { scan, shellFiles, dependencyCount, restrictJavascript, restrictPython, scanPure } = require('@sliit-foss/bashaway');

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
});

test('the folders and files should be mirrored successfully', async () => {
    if (fs.existsSync('./src')) {
        fs.rmdirSync('./src', { recursive: true });
    }
    if (fs.existsSync('./out')) {
        fs.rmdirSync('./out', { recursive: true });
    }
    fs.mkdirSync('./src');
    const folders = faker.number.int({ min: 1, max: 5 });
    let fileCount = 0;
    for (let i = 0; i < folders; i++) {
        const folder = `./src/${faker.system.directoryPath()}`;
        fs.mkdirSync(folder, { recursive: true });
        const files = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < files; j++) {
            const file = `${folder}/${faker.system.fileName().split(".")[0]}.js`;
            fs.writeFileSync(file, `console.log(${faker.word.adjective()})`);
            fileCount++;
        }
    }
    const srcFiles = scanPure('./src/**');
    expect(srcFiles.length).toBe(fileCount);
    await exec('bash execute.sh');
    const outFiles = scanPure('./out/**');
    expect(outFiles.length).toBe(fileCount);
    for (const file of srcFiles) {
        expect(fs.existsSync(`./out/${file.replace("src/", "").replace(".js", "")}_clone.js`)).toBe(true);
    }
});