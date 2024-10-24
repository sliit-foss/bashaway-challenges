const fs = require('fs');
const express = require('express');
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
        await expect(dependencyCount()).resolves.toStrictEqual(6)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check if the request is made properly', async () => {
    const generateJWT = () => {
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };
        const payload = {
            iat: faker.date.anytime().valueOf(),
            exp: faker.date.anytime().valueOf(),
        };
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        const signature = faker.string.alphanumeric(64);
        return `${encodedHeader}.${encodedPayload}.${signature}`;
    };

    const jwt = generateJWT();

    const app = express();

    app.use(express.urlencoded());

    app.post('/api/auth/login', (req, res) => {
        if (req.headers["x-api-version"] === '1.0') {
            if (req.body.username === 'bashaway' && req.body.password === '2k24') {
                res.send(jwt);
            } else {
                res.status(401).send('Unauthorized');
            }
        } else {
            res.status(400).send('Bad Request');
        }
    });

    await new Promise((resolve, reject) => {
        const server = app.listen(9000, async () => {
            const result = await exec(`bash execute.sh`);
            try {
                expect(result?.trim()).toBe(jwt);
                resolve();
            } catch (e) {
                reject(e);
            } finally {
                server.close();
            }
        });
    })
});