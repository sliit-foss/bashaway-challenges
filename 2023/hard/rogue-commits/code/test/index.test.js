const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, commitList } = require('@sliit-foss/bashaway');

jest.setTimeout(60000);

let dir

beforeAll(() => {
    dir = process.cwd();
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test("should check if branch is still on main", async () => {
    const branch = await exec('git branch --show-current');
    expect(branch?.trim()).toBe('main');
})

test('commits should be updated properly', async () => {
    if (fs.existsSync('./out')) fs.rmdirSync('./out', { recursive: true });
    const originalCommits = await commitList('https://github.com/sliit-foss/bashaway-ui.git');
    process.chdir(dir);
    const updatedCommits = await commitList('./src');
    expect(originalCommits.length).toBe(updatedCommits.length);
    for (let i = 0; i < originalCommits.length; i++) {
        expect(updatedCommits[i].message).toStrictEqual(originalCommits[i].message);
        expect(updatedCommits[i].authorEmail).toStrictEqual(originalCommits[i].authorEmail);
        expect(updatedCommits[i].commiterEmail).toStrictEqual(originalCommits[i].commiterEmail);
        if (originalCommits[i].authorName === "github-actions[bot]") {
            expect(updatedCommits[i].authorName).toStrictEqual("github-actions");
            expect(updatedCommits[i].commiterName).toStrictEqual("github-actions");
        }
    }
});