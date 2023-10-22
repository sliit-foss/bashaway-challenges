const express = require('express');
const { faker } = require('@faker-js/faker');

const app = express();

app.get('/', (_, res) => {
    res.send('Joke API is up and running');
});

app.get('/jokes/random', (_, res) => {
    res.json({
        joke: faker.lorem.sentence(),
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});