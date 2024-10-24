const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('a local cluster must be running with a namespace called bashaway', async () => {
    const namespaces = await exec('kubectl get ns');
    expect(namespaces).toContain('bashaway');
});