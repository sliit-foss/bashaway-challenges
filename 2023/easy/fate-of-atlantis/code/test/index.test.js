const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { compactString, scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should search for logs', () => {
    let logs
    beforeAll(() => {
        logs = fs.readFileSync('./src/logs.txt', 'utf-8')
    });
    test('search for correlation id - 86e7f2d8f9ceb323e7386a4c33c7553e', async () => {
       const output = await exec(`bash execute.sh 86e7f2d8f9ceb323e7386a4c33c7553e`)
       expect(compactString(output?.trim())).toMatch(compactString(logs?.trim()?.split('\n').filter(log => log.includes('86e7f2d8f9ceb323e7386a4c33c7553e'))?.join('\n')))
    });
    test('search for correlation id - e943152799966996542a17fd674a4c1f', async () => {
        const output = await exec(`bash execute.sh e943152799966996542a17fd674a4c1f`)
        expect(compactString(output?.trim())).toMatch(compactString(logs?.trim()?.split('\n').filter(log => log.includes('e943152799966996542a17fd674a4c1f'))?.join('\n')))
     });
     test('search for correlation id - 6d13bb3452f06140772e6a69a167527f', async () => {
        const output = await exec(`bash execute.sh 6d13bb3452f06140772e6a69a167527f`)
        expect(compactString(output?.trim())).toMatch(compactString(logs?.trim()?.split('\n').filter(log => log.includes('6d13bb3452f06140772e6a69a167527f'))?.join('\n')))
     });
     test('search for correlation id - 86e7f2d8f9ceb323e7386a4c33c7553e', async () => {
        const output = await exec(`bash execute.sh 86e7f2d8f9ceb323e7386a4c33c7553e`)
        expect(compactString(output?.trim())).toMatch(compactString(logs?.trim()?.split('\n').filter(log => log.includes('86e7f2d8f9ceb323e7386a4c33c7553e'))?.join('\n')))
     });
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
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});