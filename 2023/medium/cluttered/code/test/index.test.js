const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { client, insert, databaseName } = require('./insert');
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

jest.setTimeout(20000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check if database is being cleaned properly', () => {
    let data

    beforeAll(async () => {
        data = await insert();
    });

    afterAll((done) => {
        client.close().then(done);
    });

    test('should check if the database is cleaned properly', async () => {
        const db = client.db(databaseName);
        const collections = await db.listCollections().toArray();
        expect(collections.length).toBe(21);

        await exec('bash execute.sh');

        const collectionsAfter = await db.listCollections().toArray();
        expect(collectionsAfter.length).toBe(1);

        const settings = await db.collection('settings').find().toArray();
        expect(settings.map((setting) => ({ key: setting.key, value: setting.value }))).toStrictEqual(data[0].documents);
    });
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
        await expect(dependencyCount()).resolves.toStrictEqual(5)
        expect(script).not.toMatch(prohibitedCommands);
    });
});