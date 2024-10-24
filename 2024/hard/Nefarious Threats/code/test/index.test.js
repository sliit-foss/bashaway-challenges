const fs = require('fs');
const mongodb = require("mongodb")
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(10000);

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
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('properly configured server should be up and running', async () => {
    const client = new mongodb.MongoClient(`mongodb://localhost:27020/test`, {
        tls: true,
        tlsCAFile: process.env.MONGO_TLS_CA_FILE_PATH,
        tlsCertificateKeyFile: process.env.MONGO_TLS_CERT_KEY_PATH,
    });
    await client.connect();
    const db = client.db('bashaway');
    const randomString = Math.random().toString(36).substring(7);
    await db.collection('test').insertOne({ test: randomString });
    const insertedRow = await db.collection('test').findOne({ test: randomString });
    expect(insertedRow).toMatchObject({ test: randomString });
    await client.close();
});