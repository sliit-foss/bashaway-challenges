const fs = require('fs');
const { scan, shellFiles, compactString, dependencyCount, generateSecrets, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should if the .env files are generated', () => {
    test('email service secret', () => {
        expect(fs.existsSync('./out/.env.email')).toBe(true);
        const src = fs.readFileSync('./src/secrets.yml', 'utf-8')
        const content = fs.readFileSync('./out/.env.email', 'utf-8')
        expect(compactString(content).replace(/\"/g,"")).toContain(compactString(generateSecrets(src, 'email-service')));
    });
    test('sms service secret', () => {
        expect(fs.existsSync('./out/.env.sms')).toBe(true);
        const src = fs.readFileSync('./src/secrets.yml', 'utf-8')
        const content = fs.readFileSync('./out/.env.sms', 'utf-8')
        expect(compactString(content).replace(/\"/g,"")).toContain(compactString(generateSecrets(src, 'sms-service')));
    });
    test('report service secret', () => {
        expect(fs.existsSync('./out/.env.report')).toBe(true);
        const src = fs.readFileSync('./src/secrets.yml', 'utf-8')
        const content = fs.readFileSync('./out/.env.report', 'utf-8')
        expect(compactString(content).replace(/\"/g,"")).toContain(compactString(generateSecrets(src, 'report-service')));
    });
});

describe('should check installed dependencies', () => {
    let script

    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });

    test("bashaway package functions should not be called", () => {
        expect(script).not.toContain("@sliit-foss");
        expect(script).not.toContain("bashaway");
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(3)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check if there are hardcoded values', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8')
    expect(script).not.toContain("TWILIO");
    expect(script).not.toContain("MAIL_HOST");
    expect(script).not.toContain(".sms");
    expect(script).not.toContain(".env.email");
    expect(script).not.toContain(".report");
});

test('should not download external scripts', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8')
    expect(script).not.toContain("curl");
    expect(script).not.toContain("wget");
});