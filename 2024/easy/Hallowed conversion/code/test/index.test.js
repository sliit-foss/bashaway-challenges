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

test('should check if the json script is converted properly', async () => {
    const headers = Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => faker.word.noun());
    const rows = Array.from({ length: faker.number.int({ min: 25, max: 100 }) }, () => {
        return headers.reduce((acc, header) => {
            acc[header] = faker.number.int({ min: 0, max: 10000000000 });
            return acc;
        }, {});
    });
    fs.writeFileSync('./src/script.json', JSON.stringify(rows));
    if (fs.existsSync('./out')) {
        fs.rmSync('./out', { recursive: true });
    }
    await exec('bash execute.sh');
    const convertedCSV = fs.readFileSync('./out/document.csv', 'utf-8');
    const lines = convertedCSV.trim().split('\n');
    expect(lines[0].split(',')).toEqual(headers);
    expect(lines.length).toBe(rows.length + 1);
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        expect(values.length).toBe(headers.length);
        for (let j = 0; j < values.length; j++) {
            expect(parseInt(values[j])).toBe(rows[i - 1][headers[j]]);
        }
    }
});