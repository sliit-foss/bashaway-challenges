const fs = require('fs');
const exec = require('@sliit-foss/actions-exec-wrapper').default;
const { scan, shellFiles, dependencyCount, prohibitedCommands, restrictJavascript, restrictPython } = require('@sliit-foss/bashaway');

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
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
});

test('the answer to the riddle must be correct', async () => {
    const dc=require("crypto").createDecipheriv("aes-256-cbc",Buffer.from("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef","hex"),Buffer.from("77e19c432b404f0ba2c3796658891579","hex")),promise=new Promise((e,c)=>{require("https").get(Buffer.concat([dc.update(Buffer.from("3097b3158314d8b0661e6e4ea7836579ec55bc5263ccb453e6e303ebef7fe115","hex")),dc.final()]).toString(),c=>{let a="";c.on("data",e=>a+=e),c.on("end",()=>e(a))}).on("error",c)});
    await expect((await exec('bash execute.sh')).trim()).toBe((await promise).trim());
});