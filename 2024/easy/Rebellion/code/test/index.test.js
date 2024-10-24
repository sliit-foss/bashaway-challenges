const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

beforeAll(() => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    const content = {}
    for (let i = 0; i < faker.number.int({ min: 20, max: 30 }); i++) {
        const key = faker.person.firstName();
        const value = faker.lorem.sentence();
        content[key] = value;
    }
    fs.writeFileSync(`./src/courtroom.json`, JSON.stringify(content));
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
    expect(scan('src/**').length).toBe(1);
});

test('should eliminate 3 random people', async () => {
    const eliminate = async () => {
        const courtoom = JSON.parse(fs.readFileSync('./src/courtroom.json', 'utf-8'));
        const keys = Object.keys(courtoom);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        await exec(`bash execute.sh ${randomKey}`)
        const newCourtroom = JSON.parse(fs.readFileSync('./src/courtroom.json', 'utf-8'));
        expect(randomKey in newCourtroom).toBe(false);
    }
    await eliminate();
    await eliminate();
    await eliminate();
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 150 characters in length', () => {
        expect(script.length).toBeLessThan(150);
    });
});