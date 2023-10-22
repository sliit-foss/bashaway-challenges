const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(180000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the destroyed battalion count is obtained correctly', async () => {
    for (let i = 0; i < 8; i++) {
        let catapults = faker.number.int({ min: 1, max: 75 });
        const battalions = Array.from({ length: faker.number.int({ min: 1, max: 25 }) }, () => faker.number.int({ min: 1, max: 10 }));
        const destroyedBatallions = await exec(`bash execute.sh -c ${catapults} -b \'${battalions.join(' ')}\'`);
        const sortedBattalions = battalions.sort((a, b) => b - a);
        let destroyed = 0;
        while (catapults > 0) {
            const battalion = sortedBattalions.shift();
            if (catapults >= battalion) {
                catapults -= battalion;
                destroyed += 1;
            } else if (sortedBattalions.length === 0) {
                break;
            }
        }
        expect(Number(destroyedBatallions?.trim())).toBe(destroyed);
    }
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