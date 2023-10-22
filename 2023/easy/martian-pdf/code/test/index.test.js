const fs = require('fs');
const PDFDocument = require('pdfkit');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the word count is obtained properly', async () => {
    if (!fs.existsSync('./src')) fs.mkdirSync('./src');
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream('./src/mystery.pdf'));
    const pageContent = {
        1: faker.lorem.paragraph({ min: 3, max: 20 })
    }
    let page = 1;
    doc.text(pageContent[1]);
    for (let i = 0; i < faker.number.int({ min: 35, max: 60 }); i++) {
        const content = faker.lorem.paragraph({ min: 3, max: 20 });
        pageContent[++page] = content;
        doc.addPage().text(content);
    }
    doc.end();
    const testPage = faker.number.int({ min: 1, max: 40 });
    const result = await exec(`bash execute.sh ${testPage}`);
    console.log(Number(result?.trim()), pageContent[testPage]?.split(' ')?.length)
    expect(Number(result?.trim())).toStrictEqual(pageContent[testPage]?.split(' ')?.length ?? 0);
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
        expect(script).not.toMatch(prohibitedCommands);
    });
});