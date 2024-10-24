const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(300000);

let consoleTarget = faker.string.uuid();

beforeAll(async () => {
    await exec("wget https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz");
    await exec("tar xzf act_Linux_x86_64.tar.gz");
    await exec("mv act /usr/local/bin");
    await exec("rm act_Linux_x86_64.tar.gz README.md LICENSE");
    const content = fs.readFileSync('./src/index.js', 'utf-8');
    fs.writeFileSync('./src/index.js', content.replace('ae13-4ddc-8f1a-4f3b-82f1-3f7b-0b1e-9e9c', consoleTarget));
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('release workflow should exist', () => {
    const workflow = fs.readFileSync('./src/.github/workflows/launch.yml', 'utf-8');
    expect(workflow).toContain('run-name: Launch Sequence');
});

test('nothing should be hardcoded in the workflow', () => {
    const workflow = fs.readFileSync('./src/.github/workflows/launch.yml', 'utf-8');
    expect(workflow).not.toContain('ae13-4ddc-8f1a-4f3b-82f1-3f7b-0b1e-9e9c');
    expect(workflow).not.toContain(consoleTarget);
});

test('should install the published package and use it successfully on release commit and manual versioning', async () => {
    if (fs.existsSync("./out")) {
        fs.rmdirSync("./out", { recursive: true });
    }
    fs.mkdirSync("./out");
    process.chdir("./out");
    await exec("npm init -y");
    const npmrc = `@cosmos:registry=http://packages.sliitfoss.org:6873`;
    fs.writeFileSync(".npmrc", npmrc);
    const script = `const explore = require('@cosmos/launch-sequence');
explore();`;
    fs.writeFileSync("index.js", script);
    await expect(exec("npm install @cosmos/launch-sequence")).rejects.toThrow();
    process.chdir("../src");
    await exec("git commit -m \"chore: nothing\" --allow-empty");
    await new Promise(resolve => setTimeout(resolve, 40000));
    process.chdir("../out");
    await expect(exec("npm install @cosmos/launch-sequence")).rejects.toThrow();
    process.chdir("../src");
    await exec("git commit -m \"release: initial version\" --allow-empty");
    await new Promise(resolve => setTimeout(resolve, 40000));
    process.chdir("../out");
    await expect(exec("npm install @cosmos/launch-sequence")).resolves.not.toThrow();
    await expect(exec("bash -c \"npm list @cosmos/launch-sequence --depth=0 | grep @cosmos/launch-sequence | awk '{print $2}' | sed 's/@//'\"")).resolves.toContain("0.0.0");
    const output = await exec("node index.js");
    expect(output).toContain(consoleTarget);
    process.chdir("../src");
    await exec("npm version patch");

    const content = fs.readFileSync('./index.js', 'utf-8');
    const newConsoleTarget = faker.string.uuid();
    fs.writeFileSync('./index.js', content.replace(consoleTarget, newConsoleTarget));
    await exec("act -P ubuntu-22.04=catthehacker/ubuntu:full-22.04");
    await new Promise(resolve => setTimeout(resolve, 40000));
    process.chdir("../out");
    await expect(exec("npm install @cosmos/launch-sequence@0.0.1")).resolves.not.toThrow();
    await expect(exec("bash -c \"npm list @cosmos/launch-sequence --depth=0 | grep @cosmos/launch-sequence | awk '{print $2}' | sed 's/@//'\"")).resolves.toContain("0.0.1");
    const newOutput = await exec("node index.js");
    expect(newOutput).toContain(newConsoleTarget);
});