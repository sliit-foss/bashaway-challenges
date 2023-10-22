const fs = require('fs');
const { faker } = require('@faker-js/faker');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

jest.setTimeout(150000)

test('should check if the output is obtained from the pascal script', async () => {
    const text = faker.lorem.paragraph();
    const hex = faker.number.hex({ min: 1, max: 1000 })
    const int = faker.number.int({ min: 1, max: 1000 })
    const binary = faker.number.binary({min: 400, max: 4000})
    fs.writeFileSync('./src/markings.pas', `program markings;    \n\nbegin\n\n\n      writeln('${text}');\n   writeln('${hex}'); // this is a hex \n  
(* This is a binary file *)  

    writeln(${binary});\n
    
    {  This is a int }  
    writeln('${int}'); // this is an int \n  
    end.`);
    const result = await exec('bash execute.sh');
    expect(result?.trim()).toContain(text);
    expect(result?.trim()).toContain(hex.toString());
    expect(result?.trim()).toContain(int.toString());
    expect(result?.trim()).toContain(binary.toString());
    expect(result?.trim()).not.toContain('writeln');
    expect(result?.trim()).not.toContain('program markings;');
});

describe('should check constraints', () => {
    let script
    beforeAll(() => {
        script = fs.readFileSync('./execute.sh', 'utf-8')
    });
    test("nothing should be echoed or printed to the console", () => {
        expect(script).not.toContain("echo");
        expect(script).not.toContain("print");
    });
    test("cannot read or modify file the input file", () => {
        expect(script).not.toContain("cat");
        expect(script).not.toContain("awk");
        expect(script).not.toContain("sed");
    });
    test("javacript should not be used", () => {
        restrictJavascript(script)
    });
    test("python should not be used", () => {
        restrictPython(script)
    });
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});