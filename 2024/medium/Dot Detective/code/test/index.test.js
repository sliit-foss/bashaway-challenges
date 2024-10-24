const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const dot = require('dot-object');
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(15000);

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
        expect(script).not.toContain("dot-object");
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(6)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should not download external scripts', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8')
    expect(script).not.toContain("curl");
    expect(script).not.toContain("wget");
    expect(script).not.toContain("fetch");
    expect(script).not.toContain("git clone");
});

test('should check if the files are merged correctly', async () => {
    function generateChaos(depth, breadth) {
        if (depth === 0) return faker.lorem.sentence();
        let obj = {};
        for (let i = 0; i < breadth; i++) {
            if (faker.number.int({ min: 0, max: 2 })) {
                obj[faker.lorem.word()] = generateChaos(depth - 1, breadth);
            }
        }
        return obj;
    }
    const chaos = generateChaos(faker.number.int({ min: 2, max: 4 }), faker.number.int({ min: 1, max: 4 }))
    fs.writeFileSync('./src/chaos.json', JSON.stringify(chaos, null, 2));
    if (fs.existsSync('./out')) fs.rmdirSync('./out', { recursive: true });
    await exec('bash execute.sh');
    const transformed = fs.readFileSync('./out/transformed.json', 'utf-8');
    expect(JSON.parse(transformed)).toMatchObject(dot.dot(chaos));
});