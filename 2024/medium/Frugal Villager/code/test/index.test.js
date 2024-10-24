const exec = require('@sliit-foss/actions-exec-wrapper').default;
const Redis = require('ioredis').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(15000);

const port = "6381"

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('a service must be running with the name redis', async () => {
    const services = await exec('kubectl get svc -n bashaway');
    expect(services).toContain('redis');
    const forwardedPorts = await exec(`lsof -iTCP:${port} -sTCP:LISTEN -P`);
    expect(forwardedPorts).toContain(port);
});

test('must connect to the redis server', async () => {
    const password = await exec('kubectl get secret redis -n bashaway -o jsonpath="{.data.redis-password}"');
    const decodedPassword = Buffer.from(password, 'base64').toString('utf-8').trim();
    const redis = new Redis(`redis://:${decodedPassword}@127.0.0.1:${port}`);
    const ping = await redis.ping();
    expect(ping).toBe('PONG');
    redis.disconnect();
});