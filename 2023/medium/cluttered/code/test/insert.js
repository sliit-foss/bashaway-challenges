const mongodb = require('mongodb');
const { faker } = require('@faker-js/faker');

const data = [
    {
        collection: 'settings',
        documents: Array.from({ length: 10 }, () => ({
            key: faker.lorem.word(),
            value: faker.lorem.word()
        }))
    },
    ...Array.from({ length: 20 }, (_, index) => ({
        collection: `${faker.lorem.word()}-${index}`,
        documents: Array.from({ length: faker.number.int({ min: 1, max: 100 }) }, () => ({
            key: faker.lorem.word(),
            value: faker.lorem.word()
        }))
    }))
];

exports.databaseName = 'bashaway-2k23-cluttered';

exports.client = new mongodb.MongoClient('mongodb://localhost:27207/?directConnection=true');

exports.insert = async () => {
    await this.client.connect()

    const db = this.client.db(this.databaseName);

    db.dropDatabase();

    await Promise.all(JSON.parse(JSON.stringify(data)).map(({ collection, documents }) => db.collection(collection).insertMany(documents)))

    return data;
};

const args = process.argv.slice(2);

if (args.includes('--run')) {
    this.insert().then(() => {
        console.log('Data inserted successfully');
        process.exit(0);
    });
}
