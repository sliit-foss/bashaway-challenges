const fs = require('fs');
const Redis = require("ioredis");
const { scan, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

jest.setTimeout(15000);

const redis = new Redis('redis://default:5ax4*1$2@localhost:6380')

afterAll(done => {
    redis.disconnect()
    done()
})

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the connection is successfull and the keys exist', async () => {
    const stream = redis.scanStream({
        match: '*',
        type: 'string',
        count: 10000
    })
    const keys = await new Promise((resolve) => {
        const uniqueKeys = new Set()
        stream.on('data', (resultKeys) => resultKeys.forEach((key) => uniqueKeys.add(key)))
        stream.on('end', () => resolve(Array.from(uniqueKeys)))
    })
    expect(keys.length).toBe(500)
    const timestamp = await redis.get('bashaway-2k23')
    expect(Number(timestamp)).toBeGreaterThanOrEqual(new Date().getTime() - 15000)
    expect(Number(timestamp)).toBeLessThanOrEqual(new Date().getTime())
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
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});