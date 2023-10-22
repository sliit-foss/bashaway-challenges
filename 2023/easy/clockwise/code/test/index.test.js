const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
  const shellFileCount = shellFiles().length;
  expect(shellFileCount).toBe(1);
  expect(shellFileCount).toBe(scan('**').length);
});

test('should check if the output date matches the actual date', async () => {
  const outputDate = await exec('bash execute.sh');
  const actualDate = new Date().toISOString().split('T')[0];
  expect(outputDate.replace(/\n/g, '')).toBe(actualDate);
});

describe('should check constraints', () => {
  let script;
  beforeAll(() => {
    script = fs.readFileSync('./execute.sh', 'utf-8');
  });
  test('the script should have only one line', () => {
    expect(script.trim().split('\n').length).toBe(1);
  });
  test('the script should not have any chained commands', () => {
    expect(script).not.toContain('&&');
    expect(script).not.toContain('||');
  });
  test('the script should be less than 25 characters in length', () => {
    expect(script.length).toBeLessThan(25);
  });
});
