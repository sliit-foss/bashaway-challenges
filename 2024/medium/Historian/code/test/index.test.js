const { faker } = require('@faker-js/faker');
const promisify = require('util').promisify;
const exec = promisify(require('child_process').exec);
const { scan, shellFiles } = require('@sliit-foss/bashaway');

const execute = async (command) => {
    const { stdout, stderr } = await exec(command);
    if (stderr) throw new Error(stderr);
    return stdout;
};

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check for correct output', async () => {
    const count = faker.number.int({ min: 5, max: 15 });
    for (let i = 0; i < count; i++) {
        await execute(`echo "echo ${i}" >> ~/.bash_history`);
    }
    const randomNumber = faker.number.int({ min: 1, max: count });
    const history = await execute(`bash execute.sh ${randomNumber + 1}`);
    for (let i = 0; i < randomNumber; i++) {
        expect(history).toContain(`echo ${count - i - 1}`);
    }
});