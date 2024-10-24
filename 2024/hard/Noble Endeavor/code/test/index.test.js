const fs = require('fs');
const mongodb = require("mongodb")
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { faker } = require('@faker-js/faker');

jest.setTimeout(300000);

test('should migrate the data from the sql file to a mongodb database', async () => {
    if (fs.existsSync('./src')) {
        fs.rmdirSync('./src', { recursive: true });
    }
    fs.mkdirSync('./src');
    const database = faker.vehicle.model()?.split(' ')?.[0]?.toLowerCase();
    const table = faker.lorem.word();
    const columns = new Set();
    for (let i = 0; i < faker.number.int({ min: 10, max: 25 }); i++) {
        const c = faker.database.column();
        if (c != "id") columns.add(c);
    }
    const rows = faker.number.int({ min: 10, max: 10 });
    const data = Array.from({ length: rows }, () => {
        return Array.from(columns).reduce((acc, column) => {
            acc[column] = faker.number.int({ min: 0, max: 100 });
            return acc;
        }, {});
    });
    const sql = `CREATE DATABASE ${database};
    USE ${database};
    CREATE TABLE ${table} (${Array.from(columns).map(column => `\`${column}\` INT`).join(', ')});
    INSERT INTO ${table} VALUES ${data.map(row => `(${Object.values(row).join(', ')})`).join(', ')};`;
    const scrollName = faker.lorem.word();
    fs.writeFileSync(`./src/scroll-${scrollName}.sql`, sql);
    await exec('bash execute.sh');
    const client = new mongodb.MongoClient(`mongodb://admin:3aDAl3vfeRbY1lf@localhost:27020/${database}?directConnection=true`);
    await client.connect();
    const db = client.db(database);
    const insertedRows = await db.collection(table).find().toArray();
    expect(insertedRows).toHaveLength(rows);
    insertedRows.forEach((row, i) => {
        expect(row).toMatchObject(data[i]);
    });
    await client.close();
});