const { Browser, Builder, By, until } = require('selenium-webdriver')

const chrome = require('selenium-webdriver/chrome');
require('chromedriver')

jest.setTimeout(10000);

describe('should check if the application is up and running', () => {
    const rootURL = 'http://localhost:5000'

    const chromeOptions = new chrome.Options();

    chromeOptions.addArguments("--no-sandbox")
    chromeOptions.addArguments("--disable-dev-shm-usage")
    chromeOptions.addArguments("--headless")

    const d = new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build()
    const waitUntilTime = 5000
    let driver

    beforeAll(async () => {
        await d.then(async _d => {
            driver = _d
            await driver.get(rootURL)
        })
    })

    afterAll((done) => done())

    const getElementById = async (id) => {
        const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)
        return await driver.wait(until.elementIsVisible(el), waitUntilTime)
    }

    describe('payment form', () => {
        beforeEach(async () => {
            await driver.navigate().to(`${rootURL}/payment_form.jsp`);
        })
        test('payment form should exist', async () => {
            const form = await getElementById('payment_form');
            expect(form).not.toBe(null);
        });

        test('payment details section should exist', async () => {
            const section = await getElementById('paymentDetailsSection');
            expect(section).not.toBe(null);
        });

        test('click default button', async () => {
            const btn = await getElementById('defaultAll')
            await btn.click()
            const transactionTypeInput = await getElementById('transaction-type-input')
            await expect(transactionTypeInput.getAttribute("value")).resolves.toEqual('authorization');
            const amountInput = await getElementById('amount-input')
            await expect(amountInput.getAttribute("value")).resolves.toEqual('100.00');
            const currencyInput = await getElementById('currency-input')
            await expect(currencyInput.getAttribute("value")).resolves.toEqual('USD');
        })

        test('navigate to confirmation on submit', async () => {
            const btn = await getElementById('submit')
            await btn.click()
            const confirmationForm = await getElementById('payment_confirmation')
            expect(confirmationForm).not.toBe(null);
            await expect(driver.getCurrentUrl()).resolves.toContain("payment_confirmation.jsp")
        })
        test('navigate to cybersource on submit and confirm', async () => {
            const btn = await getElementById('submit')
            await expect(btn.getAttribute("value")).resolves.toEqual("Submit");
            await btn.click()
            const confirmBtn = await getElementById('confirm')
            await expect(confirmBtn.getAttribute("value")).resolves.toEqual("Confirm");
            await confirmBtn.click()
            await expect(driver.getCurrentUrl()).resolves.toContain("testsecureacceptance.cybersource.com")
        })
    })
})