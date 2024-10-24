const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const lodash = require('lodash');
const { scan, shellFiles } = require('@sliit-foss/bashaway');

jest.setTimeout(300000);

beforeAll(async () => {
    await exec("wget https://github.com/nektos/act/releases/latest/download/act_Linux_x86_64.tar.gz");
    await exec("tar xzf act_Linux_x86_64.tar.gz");
    await exec("mv act /usr/local/bin");
    await exec("rm act_Linux_x86_64.tar.gz README.md LICENSE");
});

const executionStr1 = 'Executing seeded connection for Golang version go1.21.0';
const executionStr2 = 'Executing seeded connection for Golang version go1.22.0';

const suites = [
    'TestConnection',
    'TestCoreAudit',
    'TestCoreCreate',
    'TestCoreDelete',
    'TestCoreMeta',
    'TestCoreMiddleware',
    'TestCoreReadIs',
    'TestCoreReadOps',
    'TestCoreReadPaginate',
    'TestCoreReadPopulate',
    'TestCoreReadSelect',
    'TestCoreRead',
    'TestCoreSchemaOptions',
    'TestCoreTriggers',
    'TestCoreUpdate',
    'TestPluginFilterQuery',
];

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('nothing should be hardcoded in the workflow', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8');
    suites.forEach((test) => {
        expect(script).not.toContain(test);
        expect(script).not.toContain(test.toLowerCase());
        expect(script).not.toContain(lodash.camelCase(test));
        expect(script).not.toContain(lodash.kebabCase(test));
        expect(script).not.toContain(lodash.snakeCase(test));
        if (!["TestCoreReadIs", "TestCoreCreate", "TestCoreDelete", "TestCoreRead", "TestCoreUpdate"].includes(test)) expect(script).not.toContain(lodash.snakeCase(test).split('_').reverse()[0]);
    });
    expect(script).not.toContain(executionStr1);
    expect(script).not.toContain(executionStr2);
});

test('the test workflow must be properly configured', async () => {
    process.chdir('./src');
    const result = await exec('act -j unit-tests -P ubuntu-22.04=catthehacker/ubuntu:full-22.04');
    expect(result).toContain(executionStr1);
    expect(result).toContain(executionStr2);
    expect(result).toContain('353 total assertions');
    suites.forEach((test) => {
        expect(result).toContain(`PASS: ${test}`);
    });
});