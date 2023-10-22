const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, compactString, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

const merged = []

beforeAll(() => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    for (let i = 0; i < faker.number.int({ min: 4, max: 8 }); i++) {
        let content = `Item,Value(Gold Drakes)`;
        for (let i = 0; i < faker.number.int({ min: 20, max: 35 }); i++) {
            const data = { name: faker.commerce.productName(), value: Number(faker.finance.amount()) }
            content += `\n${data.name},${data.value}`;
            merged.push(`${data.name},${(data.value * 178).toFixed(2)}`);
        }
        fs.writeFileSync(`./src/${faker.word.noun()}.csv`, content);
    }
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the scrolls are merged properly', async () => {
    await exec('bash execute.sh');
    merged.sort((a, b) => Number(b.split(',')[1]) - Number(a.split(',')[1]));
    expect(compactString(fs.readFileSync(`./out/merged-scrolls.csv`, 'utf-8'))).toBe(compactString([`Item,Value(Silver Sovereigns)`, ...merged].join('\n')));
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
    });
    test("javascript should not be used", () => {
        restrictJavascript(script)
        expect(script).not.toContain("fs.readFile");
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});