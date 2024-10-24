const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
    expect(scan('src/**').length).toBe(2);
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
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 100 characters in length', () => {
        expect(script.length).toBeLessThan(100);
    });
});

test('should not have tampered with the original files', () => {
    const gearsSize = fs.statSync('src/gears.js').size;
    expect(gearsSize).toBe(829);
    const gearsTemporarySize = fs.statSync('src/gears-1719135696714.js').size;
    expect(gearsTemporarySize).toBe(1500);
});

test('patch file should be present', () => {
    expect(fs.existsSync('out/gearsmith.patch')).toBeTruthy();
});

test('should apply patch successfully', async () => {
    process.chdir('src');
    await exec('patch -i ../out/gearsmith.patch');
    const consoleOutput = await exec('node gears.js');
    [
        'Gear setup initialized.',
        'Calculating circumference for diameter: 10',
        'Circumference calculated',
        'Calculating driven speed with driverSpeed: 150 and ratio: 2.5',
        'Driven speed calculated: 60',
        'Calculating gear ratio with teeth1: 20 and teeth2: 8',
        'Gear ratio calculated: 2.5',
        'Starting example usage.',
        'Circumference of the gear',
        'Speed of the driven gear: 60',
        'Calculated gear ratio: 2.5',
        'Gear calculations complete.',
        'End of script.'
    ].forEach(text => {
        expect(consoleOutput).toContain(text);
    });
});