
const mysql = require("mysql2/promise")
const mongodb = require("mongodb")

const run = async () => {
    const args = process.argv.slice(2);

    const database = args[0];

    const table = args[1];

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: 3307,
        database
    })

    await connection.connect();

    const [rows] = await connection.query(`SELECT * FROM ${table}`);

    const client = new mongodb.MongoClient(`mongodb://admin:3aDAl3vfeRbY1lf@localhost:27020/${database}?directConnection=true`)

    await client.connect();

    const db = client.db(database);

    const collection = db.collection(table);

    await collection.insertMany(rows);

    process.exit(0)
}

run()