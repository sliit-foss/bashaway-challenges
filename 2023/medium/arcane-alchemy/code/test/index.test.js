const fs = require('fs');
const { faker } = require('@faker-js/faker');
const convert = require('xml-js');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

let filename = null, data = null;

beforeAll(async () => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    filename = faker.word.noun();
    data = {
        [faker.word.noun()]: Array(faker.number.int({ min: 25, max: 50 })).fill(0).reduce((acc) => {
            acc[faker.word.noun()] = faker.word.adjective();
            return acc;
        }, {})
    }
    fs.writeFileSync(`./src/${filename}.xml`, convert.json2xml(data, { compact: true, ignoreComment: true, spaces: 4 }));
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the xml file is converted properly to JSON', async () => {
    await exec('bash execute.sh');
    expect(JSON.stringify(JSON.parse(fs.readFileSync(`./out/${filename}.json`, 'utf-8')))).toStrictEqual(JSON.stringify(data));
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javascript should not be used", () => {
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