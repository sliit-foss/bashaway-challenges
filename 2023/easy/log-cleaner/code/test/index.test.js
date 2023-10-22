const fs = require('fs');
const exec = require("@sliit-foss/actions-exec-wrapper").default;
const { scan, scanPure, shellFiles, cleanLogs, compactString, dependencyCount, prohibitedCommands } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

test('should check if there are 5 output files', () => {
    expect(scanPure('./out/**').length).toBe(5);
});

describe('should check if the logs are removed', () => {
    test('dart', () => {
        expect(fs.existsSync('./out/cache.dart')).toBe(true);
        const src = fs.readFileSync('./src/cache.dart', 'utf-8')
        const content = fs.readFileSync('./out/cache.dart', 'utf-8')
        expect(compactString(content)).toStrictEqual(cleanLogs(src))
    });
    test('java', () => {
        expect(fs.existsSync('./out/Seeder.java')).toBe(true);
        const src = fs.readFileSync('./src/Seeder.java', 'utf-8')
        const content = fs.readFileSync('./out/Seeder.java', 'utf-8')
        expect(compactString(content)).toStrictEqual(cleanLogs(src))
    });
    test('csharp', () => {
        expect(fs.existsSync('./out/Math.cs')).toBe(true);
        const src = fs.readFileSync('./src/Math.cs', 'utf-8')
        const content = fs.readFileSync('./out/Math.cs', 'utf-8')
        expect(compactString(content)).toStrictEqual(cleanLogs(src))
    });
    test('python', () => {
        expect(fs.existsSync('./out/mystery.py')).toBe(true);
        const src = fs.readFileSync('./src/mystery.py', 'utf-8')
        const content = fs.readFileSync('./out/mystery.py', 'utf-8')
        expect(compactString(content)).toStrictEqual(cleanLogs(src))
    });
    describe('javascript', () => {
        test('console.logs removed', () => {
            expect(fs.existsSync('./out/index.js')).toBe(true);
            const src = fs.readFileSync('./src/index.js', 'utf-8')
            const content = fs.readFileSync('./out/index.js', 'utf-8')
            expect(compactString(content)).toStrictEqual(cleanLogs(src))
        });
        test('script should execute', async () => {
            await expect(exec("node ./out/index.js")).resolves.toContain("Hello World");
        });
    })
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
    expect(script).not.toContain("package:flutter_secure_storage/flutter_secure_storage.dart");
    expect(script).not.toContain("process.env.DISABLE_FUNCTION_TRACING");
    expect(script).not.toContain("using System;");
    expect(script).not.toContain("import random");
    expect(script).not.toContain("org.springframework.boot.CommandLineRunner");
});

test('should not download external scripts', () => {
    const script = fs.readFileSync('./execute.sh', 'utf-8')
    expect(script).not.toContain("curl");
    expect(script).not.toContain("wget");
});