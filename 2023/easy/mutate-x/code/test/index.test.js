const fs = require('fs');
const { scan, scanPure, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
  const shellFileCount = shellFiles().length;
  expect(shellFileCount).toBe(1);
  expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if there is only one output file', () => {
  expect(scanPure('./out/**').length).toBe(1);
});
test('should check if the output file name is mutateX.txt', () => {
  expect(scanPure('./out/**')[0].endsWith('mutateX.txt')).toBe(true);
});
describe('should check installed dependencies', () => {
  let script;
  beforeAll(() => {
    script = fs.readFileSync('./execute.sh', 'utf-8');
  });
  test('bashaway package functions should not be called', () => {
    expect(script).not.toContain('@sliit-foss');
    expect(script).not.toContain('bashaway');
  });
  test('no additional npm dependencies should be installed', async () => {
    await expect(dependencyCount()).resolves.toStrictEqual(3);
    expect(script).not.toMatch(prohibitedCommands);
  });
});
