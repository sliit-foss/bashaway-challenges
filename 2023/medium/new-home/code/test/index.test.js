const fs = require('fs');
const mongodb = require('mongodb');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

jest.setTimeout(60000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('populate data and check if it is cloned properly', () => {
    let insertedDatabases = null;
    const originInstance = new mongodb.MongoClient('mongodb://localhost:27207/?directConnection=true');
    const targetInstance = new mongodb.MongoClient('mongodb://localhost:27208/?directConnection=true');

    beforeAll(async () => {
        await Promise.allSettled([
            exec('docker run -d --name bashaway-2k23-sunset -p 27207:27017 mongo'),
            exec('docker run -d --name bashaway-2k23-sunrise -p 27208:27017 mongo')
        ])
        insertedDatabases = Array.from({ length: 5 }, (_, index) => ({
            database: `${faker.lorem.word()}-${index}`,
            collections: Array.from({ length: 10 }, (_, index) => ({
                name: `${faker.lorem.word()}-${index}`,
                documents: Array.from({ length: faker.number.int({ min: 1, max: 25 }) }, () => ({
                    key: faker.lorem.word(),
                    value: faker.lorem.word()
                }))
            }))
        }))
        await originInstance.connect();
        const admin = targetInstance.db().admin();
        const existingDatabases = (await admin.listDatabases())?.databases || [];
        await Promise.all(existingDatabases.map(({ name }) => {
            if (!["admin", "config", "local"].includes(name)) originInstance.db(name).dropDatabase();
        }));
        await Promise.all(insertedDatabases.map(({ database, collections }) => {
            const db = originInstance.db(database);
            return Promise.all(collections.map(({ name, documents }) => db.collection(name).insertMany(documents)));
        }))
    });

    afterAll((done) => {
        Promise.all([originInstance.close(), targetInstance.close()]).then(() => done());
    });

    test('should check if all of the data from the origin instance exists in the target instance', async () => {
        await targetInstance.connect();
        const admin = targetInstance.db().admin();

        const existingDatabases = (await admin.listDatabases())?.databases || [];
        await Promise.all(existingDatabases.map(({ name }) => {
            if (!["admin", "config", "local"].includes(name)) targetInstance.db(name).dropDatabase();
        }));

        await exec('bash execute.sh');

        const databases = (await admin.listDatabases()).databases.filter(({ name }) => !["admin", "config", "local"].includes(name));
        expect(databases.length).toBe(5);

        const databaseNames = databases.map((database) => database.name);

        expect(databaseNames.sort()).toEqual(insertedDatabases.map(({ database }) => database).sort());

        await Promise.all(insertedDatabases.map(async ({ database, collections: originalCollections }) => {
            const db = targetInstance.db(database);
            const collections = await db.listCollections().toArray();
            expect(collections.length).toBe(originalCollections.length);
            await Promise.all(originalCollections.map(async ({ name, documents: originalDocs }) => {
                const availableDocs = await db.collection(name).find().toArray();
                expect(availableDocs).toStrictEqual(originalDocs);
            }));
        }))
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