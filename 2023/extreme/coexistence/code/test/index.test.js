const { Browser, Builder, By, until } = require('selenium-webdriver')
const { scan, shellFiles, dependencyCount } = require('@sliit-foss/bashaway');

const chrome = require('selenium-webdriver/chrome');
require('chromedriver')

jest.setTimeout(10000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles().length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check if the websites were merged successfully', () => {
    const rootURL = 'http://localhost:8088'
    
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

    const click = async (el) => {
        await el.click()
    } 

    test('non existant routes should display 404 page of the cornerstone', async () => {
        await driver.navigate().to(rootURL);
        await expect(driver.getTitle()).resolves.toBe('Home | Cornerstone');
        await driver.navigate().to(rootURL + '/abc');
        await expect(driver.getTitle()).resolves.toBe('404 | Cornerstone');
        await getElementById('home-btn').then(click)
        await expect(driver.getTitle()).resolves.toBe('Home | Cornerstone');
    });

    test('should navigate to and back from the dashboard successfully', async () => {
        await driver.navigate().to(rootURL);
        await getElementById('dashboard-btn').then(click)
        await expect(driver.getTitle()).resolves.toBe('Dashboard');
        await getElementById('home-btn').then(click)
        await expect(driver.getTitle()).resolves.toBe('Home | Cornerstone');
    });

    describe('support page', () => {
        test('should navigate to and back successfully', async () => {
            await driver.navigate().to(rootURL);
            await getElementById('support-btn').then(click)
            await expect(driver.getTitle()).resolves.toBe('Support');
            await getElementById('home-btn').then(click)
            await expect(driver.getTitle()).resolves.toBe('Home | Cornerstone');
        });
        test('should check element styles', async () => {
            await driver.navigate().to(rootURL + '/support');
            const title = await getElementById('title');
            expect(title.getCssValue('font-size')).resolves.toBe('60px');
            expect(title.getCssValue('color')).resolves.toBe('rgba(0, 0, 0, 1)');
            const homeBtn = await getElementById('home-btn');
            expect(homeBtn.getCssValue('background-color')).resolves.toBe('rgba(0, 0, 0, 1)');
            expect(homeBtn.getCssValue('font-size')).resolves.toBe('20px');
        });
    });
});

describe('should check installed dependencies', () => {
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(4)
    });
});