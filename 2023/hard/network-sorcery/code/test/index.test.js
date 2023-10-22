const fs = require('fs');
const https = require('https');
const axios = require('axios').default;
const { scan, shellFiles, dependencyCount } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check if requests are routed properly', () => {
    let baseUrl = "https://api.jokes.bashaway.sliitfoss.org"
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    test('request to base path', async () => {
        await axios.get(baseUrl, { httpsAgent: agent }).then((res) => {
            expect(res.data).toBe('Joke API is up and running');
        })
    });
    test('request to /jokes/random', async () => {
        await axios.get(baseUrl + '/jokes/random', { httpsAgent: agent }).then((res) => {
            expect(res.data.joke).not.toBeUndefined();
        });
    });
});

describe('should check installed dependencies', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(6)
    });
});