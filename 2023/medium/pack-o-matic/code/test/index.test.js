const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, scanPure } = require('@sliit-foss/bashaway');

jest.setTimeout(60000);

beforeAll(() => {
    if (fs.existsSync('./src')) fs.rmSync('./src', { recursive: true });
    fs.mkdirSync('./src');
    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
        let fileName = faker.system.fileName();
        fileName = `${fileName.split('.')[0].replaceAll("_", "-")}-${faker.number.hex(255)}` + '.sh';
        fs.writeFileSync(`./src/${fileName}`, `echo "You just executed the ${fileName.replace('.sh', '')} script"`);
    }
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles(["src/**"]).length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if scripts are packaged properly', async () => {
    const files = scanPure('src/**');
    await exec('bash execute.sh');
    for (const file of files) {
        const name = (file.includes("/") ? file.split("/") : file.split("\\")).pop().replace(".sh", "");
        expect(fs.existsSync(`./out/${name}.tgz`)).toBeTruthy();
        await exec(`npm i -g ./out/${name}.tgz`);
        await expect(exec(`bash -c \"${name}\"`)).resolves.toContain(`You just executed the ${name} script`);
    }
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
        expect(script).not.toContain("scanPure");
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4);
    });
});