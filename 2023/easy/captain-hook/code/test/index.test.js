const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test("should check if a git repository is initialized", () => {
    expect(fs.existsSync('.git')).toBe(true);
});

test("should check if commit messages are recorded properly", async () => {
    const messages = Array.from({ length: 5 }, () => Math.random().toString(36).substring(7));
    for (const message of messages) {
        fs.appendFileSync('./src/something-to-commit.txt', message);
        await exec(`git add .`);
        await exec(`git commit -m "test commit - ${message}"`);
        const outputFile = fs.readFileSync('./out/commits.txt', 'utf-8');
        expect(outputFile).toContain(message);
    }
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});