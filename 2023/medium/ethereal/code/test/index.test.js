const fs = require('fs');
const { faker } = require('@faker-js/faker');;
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(60000)

let output = '';

beforeAll(async () => {
    if (!fs.existsSync('./src')) fs.mkdirSync('./src');
    output = faker.lorem.sentence();
    fs.writeFileSync('src/script.sh', `#!/bin/bash \n \n echo "${output}"`);
    fs.writeFileSync('src/package.json',JSON.stringify( {
        "name": "etherealbinarybeast",
        "version": "0.0.0",
        "bin": "script.sh"
    }));
    const currentDir = process.cwd();
    process.chdir('src');
    await exec('npm pack');
    await exec('bash -c \"sudo npm i -g etherealbinarybeast-0.0.0.tgz\"')
    fs.rmSync('etherealbinarybeast-0.0.0.tgz')
    fs.rmSync('package.json')
    fs.rmSync('script.sh')
    process.chdir(currentDir);
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles(['src/**']).length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the shortcut is setup properly', async () => {
    await exec('bash execute.sh');
    const result = await exec('bash -c "ethereal"');
    expect(result?.trim()).toStrictEqual(output);
});