const fs = require('fs');
const { scan, scanPure, shellFiles, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
  const shellFileCount = shellFiles().length;
  expect(shellFileCount).toBe(1);
  expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if the output files have been filtered correctly', () => {
  expect(scanPure('out/**').length).toStrictEqual(scanPure('src/**').filter((file) => !file.includes('534')).length);
});

test('should check if the output files match the input files', () => {
  scanPure('out/**').forEach((file) => {
    expect(fs.readFileSync(file, 'utf-8')).toBe(fs.readFileSync(file.replace('out', 'src'), 'utf-8'));
  });
});

describe('should check constraints', () => {
  let script;
  beforeAll(() => {
    script = fs.readFileSync('./execute.sh', 'utf-8');
  });
  test('should check for python usage', () => {
    expect(script).not.toContain('python');
    expect(script).not.toContain('.py');
  });
  test('should check for javascript usage', () => {
    expect(script).not.toContain('node');
    expect(script).not.toContain('.js');
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
