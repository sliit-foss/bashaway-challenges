const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(15000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should not download external scripts', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8')
    expect(script).not.toContain("curl");
    expect(script).not.toContain("wget");
    expect(script).not.toContain("fetch");
    expect(script).not.toContain("git clone");
});

describe('should if the .env files are generated', () => {
    const keys = {};
    beforeAll(async () => {
        for (let i = 0; i < faker.number.int({ min: 10, max: 25 }); i++) {
            keys[faker.word.noun().toUpperCase()] = faker.system.fileName();
        }
        fs.writeFileSync(`./src/.env.example`, Object.keys(keys).map(key => `${key}=`).join('\n'));
        await exec('bash execute.sh');
    });
    test('docker image should build and run with the correct environment variables', async () => {
        const tag = 'bashaway-2k24-enchanted-artifact'
        process.chdir("./src");
        await exec(`docker build ${Object.entries(keys).map(([key, value]) => `--build-arg ${key}=${value}`).join(' ')} -t ${tag} .`);
        await exec(`docker run -d -p 3000:3000 --name=${tag} ${tag}`)
        await expect(exec(`docker ps -f name=${tag} --format "{{.Names}}-{{.Ports}}"`)).resolves.toContain(`${tag}-0.0.0.0:3000->`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        const result = await exec(`curl http://localhost:3000`);
        expect(JSON.parse(result)).toMatchObject(keys);
    });
});