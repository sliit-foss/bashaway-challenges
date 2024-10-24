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
});

test('should check if the text is decoded correctly', async () => {
    if (!fs.existsSync('./src')) fs.mkdirSync('./src');
    const words = [];
    const content = Array.from({ length: faker.number.int({ min: 100, max: 200 }) }).map(_ => {
        const word = faker.word.noun();
        const encoded = Buffer.from(word).toString('base64');
        words.push(word);
        return encoded;
    }).join('\n');
    fs.writeFileSync('./src/codes.txt', content);
    if (fs.existsSync('./out')) fs.rmdirSync('./out', { recursive: true });
    await exec('bash execute.sh');
    const decodedText = fs.readFileSync('./out/decoded.txt', 'utf-8');
    expect(decodedText.trim()).toBe(words.join('\n'));
});