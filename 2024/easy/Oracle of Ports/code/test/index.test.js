const fs = require('fs');
const { spawn } = require('child_process');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

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
        await expect(dependencyCount()).resolves.toStrictEqual(5)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 30 characters in length', () => {
        expect(script.length).toBeLessThan(30);
    });
});

test('a local cluster must be running with a namespace called bashaway', async () => {
    const port = faker.number.int({ min: 3000, max: 5000 });

    const script = `
        const express = require('express');
        const app = express();
        app.get('/system/health', (req, res) => {
            res.status(200).send('OK');
        });
        app.listen(${port}, ()=>{
             console.log('Server started');
        });
    `

    const child = spawn(process.execPath, ['-e', script]);

    await new Promise((resolve) => {
        child.stdout.on('data', (data) => {
            if (data.toString().includes('Server started')) {
                resolve();
            }
        })
    });

    const response = await exec(`curl http://localhost:${port}/system/health`);
    expect(response).toBe('OK');
    await exec(`bash execute.sh ${port}`)
    await expect(exec(`curl http://localhost:${port}/system/health`)).rejects.toThrow();
});