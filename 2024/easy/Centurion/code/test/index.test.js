const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');
const { scan, shellFiles, dependencyCount, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

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
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
    });
});

test('the script should handle the requirement succesfully', async () => {
    const branchPrefixes = [
        "feature",
        "hotfix",
        "release",
        "fix",
        "bugfix",
        "refactor",
        "chore",
        "docs",
    ]
    if (fs.existsSync('./out')) {
        fs.rmdirSync('./out', { recursive: true });
    }
    fs.mkdirSync('./out');
    process.chdir('./out');
    await exec('git init');
    fs.writeFileSync(`./${faker.word.noun()}.txt`, faker.lorem.paragraph());
    await exec('git add .');
    await exec('git config user.email "github-actions[bot]@users.noreply.github.com"');
    await exec('git config user.name "github-actions[bot]"');
    await exec('git commit -m "Initial commit"');
    await exec('git branch -m main');
    const branchNames = ["main"];
    for (let i = 0; i < faker.number.int({ min: 50, max: 100 }); i++) {
        const randomPrefix = branchPrefixes[Math.floor(Math.random() * branchPrefixes.length)];
        const branchName = randomPrefix + '/' + faker.word.noun();
        await exec(`git switch -c ${branchName}`);
        branchNames.push(branchName);
    }
    const branchNamesBeforeDeletion = await exec('git branch --format="%(refname:short)"').then(result=>result.split('\n').filter(Boolean));
    expect(branchNamesBeforeDeletion.sort()).toEqual(branchNames.sort());
    const randomPrefix = branchPrefixes[Math.floor(Math.random() * branchPrefixes.length)];
    await exec(`bash ../execute.sh ${randomPrefix}`);
    const branchNamesAfterDeletion = await exec('git branch --format="%(refname:short)"').then(result=>result.split('\n').filter(Boolean));
    expect(branchNamesAfterDeletion.sort()).toEqual(branchNames.filter(branchName => !branchName.startsWith(randomPrefix)).sort());
});