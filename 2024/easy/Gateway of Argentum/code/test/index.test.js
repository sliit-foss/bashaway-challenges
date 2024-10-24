const fs = require('fs');
const { faker } = require('@faker-js/faker');
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
        await expect(dependencyCount()).resolves.toStrictEqual(4)
        expect(script).not.toMatch(prohibitedCommands);
    });
});

test('should check if the card details are masked', async () => {
    const cardNumbers = [];
    for (let i = 0; i < faker.number.int({ min: 100, max: 200 }); i++) {
        cardNumbers.push(faker.finance.creditCardNumber("################"));
    }
    fs.writeFileSync('./src/parchment.txt', cardNumbers.join('\n'));
    fs.rmdirSync('./out', { recursive: true });
    await exec('bash execute.sh');
    const masked = fs.readFileSync('./out/masked.txt', 'utf-8');
    const maskedCardNumbers = masked.trim().split('\n').filter(n => n);
    expect(maskedCardNumbers).toHaveLength(cardNumbers.length);
    maskedCardNumbers.forEach((maskedCardNumber, index) => {
        const cardNumber = cardNumbers[index];
        const last4Digits = cardNumber.slice(-4);
        expect(maskedCardNumber).toBe(cardNumber.replace(last4Digits, '').replace(/\d/g, '*') + last4Digits);
    });
});