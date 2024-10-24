const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should build the script into a runnable executable', async () => {
    await exec('bash execute.sh')
    const version = await exec('go version out/blade')
    expect(version?.trim()).toBe('out/blade: go1.17.2')
    const result = await exec('out/blade')
    expect(result?.trim()).toBe('Hello there... Welcome to Bashaway 2k24!')
});