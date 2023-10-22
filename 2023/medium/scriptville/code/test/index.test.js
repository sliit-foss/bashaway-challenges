const fs = require('fs');
const axios = require('axios');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictPython } = require('@sliit-foss/bashaway');

let imageData = [];

beforeAll(async () => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    imageData = await Promise.all(Array.from({ length: faker.number.int({ min: 10, max: 20 }) }, async () => {
        const width = faker.number.int({ min: 200, max: 700 })
        const height = faker.number.int({ min: 200, max: 700 })
        const filename = faker.system.fileName().split(".")[0]
        const imageUrl = faker.image.urlLoremFlickr({ width, height })
        await axios({
            method: 'get',
            url: imageUrl,
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(fs.createWriteStream(`./src/${filename}.jpg`))
        });
        return { name: filename, width, height }
    }))
});

afterAll((done) => done());

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the images are resized properly', async () => {
    await exec('bash execute.sh');
    await Promise.all(imageData.map(async ({ name, width, height }) => {
        const size = await exec(`identify -format "%wx%h" out/${name}.jpg`);
        expect(size).toBe(`${width * 4}x${height * 4}`);
    }))
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(5)
        expect(script).not.toMatch(prohibitedCommands);
    });
});