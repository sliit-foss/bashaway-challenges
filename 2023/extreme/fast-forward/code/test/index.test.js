const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, commitList, prohibitedCommands } = require('@sliit-foss/bashaway');

jest.setTimeout(90000);

let dir

beforeAll(() => {
    dir = process.cwd();
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    const shellFilesWithinSrc = 7;
    expect(shellFileCount).toBe(1 + shellFilesWithinSrc);
    expect(shellFileCount - shellFilesWithinSrc).toBe(scan('**', ['src/**']).length);
});

test("should check if branch is still on main", async () => {
    const branch = await exec('git branch --show-current');
    expect(branch?.trim()).toBe('main');
})

test('commits should be forwarded properly', async () => {
    if (fs.existsSync('./out')) fs.rmdirSync('./out', { recursive: true });
    const originalCommits = await commitList('https://github.com/sliit-foss/npm-catalogue.git');
    process.chdir(dir);
    const forwardCommits = await commitList('./src');
    expect(originalCommits.length).toBe(forwardCommits.length);
    for (let i = 0; i < originalCommits.length; i++) {
        expect(forwardCommits[i].message).toStrictEqual(originalCommits[i].message);
        expect(forwardCommits[i].timestamp).toStrictEqual(originalCommits[i].timestamp + 1000 * 60 * 60 * 24 * 13);
        expect(forwardCommits[i].authorName).toStrictEqual(originalCommits[i].authorName);
        expect(forwardCommits[i].authorEmail).toStrictEqual(originalCommits[i].authorEmail);
        expect(forwardCommits[i].commiterName).toStrictEqual(originalCommits[i].commiterName);
        expect(forwardCommits[i].commiterEmail).toStrictEqual(originalCommits[i].commiterEmail);
    }
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        process.chdir(dir);
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});