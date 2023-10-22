const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, ghOrgRepos } = require('@sliit-foss/bashaway');

jest.setTimeout(120000);

let dir

beforeAll(() => {
    dir = process.cwd();
});

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('all organization repos must be cloned properly', async () => {
    await exec('bash -c \"git clone-gh-org sliit-foss ./out\"')
    const repos = await ghOrgRepos('sliit-foss');
    const clonedRepos = fs.readdirSync(`out`);
    expect(repos.length).toBe(clonedRepos.length);
    for (const repo of repos) {
        process.chdir(`out/${repo.name}`);
        const actual = await exec('bash -c \"basename $(git remote get-url origin)\"')
        expect(actual.trim().replace(new RegExp('\.git$'), '')).toStrictEqual(repo.name)
        process.chdir(dir)
    }
});