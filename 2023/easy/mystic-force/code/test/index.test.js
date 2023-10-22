const fs = require('fs');
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(180000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

afterAll(() => {
    fs.writeFileSync('./src/a.txt', 'Haylow');
});

test('should check if a.txt is duplicated and linked properly', async () => {
    expect(fs.readFileSync('./src/b.txt', 'utf-8')).toBe('Haylow');
    fs.appendFileSync('./src/a.txt', ' World!');
    expect(fs.readFileSync('./src/b.txt', 'utf-8')).toBe('Haylow World!');
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
        await expect(dependencyCount()).resolves.toStrictEqual(2)
        expect(script).not.toMatch(prohibitedCommands);
    });
    test('the script should be less than 30 characters in length', () => {
        expect(script.length).toBeLessThan(30);
    });
});