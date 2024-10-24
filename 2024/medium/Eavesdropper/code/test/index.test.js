const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('a local cluster must be running with the metrics server installed', async () => {
    const result = await exec('kubectl top nodes');
    expect(result).toContain('NAME');
    expect(result).toContain('CPU');
    expect(result).toContain('MEMORY');
});