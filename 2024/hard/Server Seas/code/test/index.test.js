const fs = require('fs');
const express = require('express');
const axios = require('axios').default  ;
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(15000)

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
        await expect(dependencyCount()).resolves.toStrictEqual(7)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check if the requests are forwarded properly', async () => {

    const responseStr = faker.string.alphanumeric(64);

    const server1 = express();

    server1.get('/', (_, res) => {
        res.setHeader('x-host-port', 'localhost:11001');
        res.send(responseStr);
    });

    const startedServer1 = await new Promise((resolve) => {
        const server = server1.listen(11001, async () => {
            resolve(server);
        });
    })

    const server2 = express();

    server2.get('/', (_, res) => {
        res.setHeader('x-host-port', 'localhost:11002');
        res.send(responseStr);
    });

    const startedServer2 = await new Promise((resolve) => {
        const server = server2.listen(11002, async () => {
            resolve(server);
        });
    })

    const server3 = express();

    server3.get('/', (_, res) => {
        res.setHeader('x-host-port', 'localhost:11003');
        res.send(responseStr);
    })

    const startedServer3 = await new Promise((resolve) => {
        const server = server3.listen(11003, async () => {
            resolve(server);
        });
    })

    try {
        const err = await axios.get('http://localhost:11000').catch(e => "Error");
        expect(err).toBe("Error");
        await exec(`bash execute.sh`);
        let server1Count = 0;
        let server2Count = 0;
        let server3Count = 0;
        for (let i = 0; i < 100; i++) {
            const response = await axios.get('http://localhost:11000');
            expect(response.data).toBe(responseStr);
            if (response.headers['x-host-port'] === 'localhost:11001') {
                server1Count++;
            } else if (response.headers['x-host-port'] === 'localhost:11002') {
                server2Count++;
            } else if (response.headers['x-host-port'] === 'localhost:11003') {
                server3Count++;
            }
        }
        expect(server1Count).toBeGreaterThan(0);
        expect(server2Count).toBeGreaterThan(0);
        expect(server3Count).toBeGreaterThan(0);
    } catch (e) {
        throw e
    } finally {
        startedServer1.close();
        startedServer2.close();
        startedServer3.close();
    }
});
