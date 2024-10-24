const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("javacript should not be used", () => {
        expect(script).not.toContain("node")
        expect(script).not.toContain("require")
        expect(script).not.toContain("npm")
        expect(script).not.toContain("npx")
        expect(script).not.toContain("yarn")
        expect(script).not.toContain("pnpm")
        expect(script).not.toContain("dlx")
        expect(script).not.toContain("bunx")
        expect(script).not.toContain("deno")
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
    });
    test("the Github API must not be called", () => {
        expect(script).not.toContain("api.github.com")
        expect(script).not.toContain("github.com")
        expect(script).not.toContain("github")
    });
});

test('the issue count must be retrieved and printed successfully', async () => {
    const { data } = await require('axios').default(Buffer.from('aHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9zZWFyY2gvaXNzdWVzP3E9cmVwbzpvdmVuLXNoL2J1bitpczppc3N1ZStpczpvcGVuK2xhYmVsOmJ1Zw==' , 'base64').toString('ascii'));
    expect(Number((await exec('bash execute.sh')))).toBe(data.total_count);
    const script = fs.readFileSync('./execute.sh', 'utf-8');
    expect(script).not.toContain(`${data.total_count}`)
});