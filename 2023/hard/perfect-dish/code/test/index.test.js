const { Browser, Builder, By, until } = require('selenium-webdriver')
const { scan, shellFiles, dependencyCount } = require('@sliit-foss/bashaway');
const exec = require("@sliit-foss/actions-exec-wrapper").default;

const chrome = require('selenium-webdriver/chrome');
require('chromedriver')

jest.setTimeout(10000);

test('should validate if only bash files are present', () => {
    const shellFileCount = shellFiles(['src/**']).length;
    expect(shellFileCount).toBe(1);
    expect(shellFileCount).toBe(scan('**', ['src/**']).length);
});

describe('should check if the application is up and running', () => {
    const rootURL = 'http://localhost:8001'

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

    test('page title', async () => {
        await driver.navigate().to(rootURL);
        await expect(driver.getTitle()).resolves.toBe('Laravel');
    });

    test('title', async () => {
        await driver.navigate().to(rootURL);
        const result = await getElementById('title');
        await expect(result.getText()).resolves.toBe('Laravel');
    });

    test('links', async () => {
        await driver.navigate().to(rootURL);
        const result = await getElementById('links');
        const links = ['Docs', 'Laracasts', 'News', 'Blog', 'Nova', 'Forge', 'Vapor', 'GitHub'];
        const children = await result.findElements(By.tagName('a'))
        await Promise.all(children.map(async (el, index) => {
            await expect(el.getAttribute('href')).resolves.not.toBe(null);
            await expect(el.getText()).resolves.toBe(links[index].toUpperCase());
        }));
    });
});

test('docker container should be running', async () => {
    await expect(exec('docker ps -f name=bashaway-2k23-perfect-dish --format "{{.Names}}-{{.Ports}}"')).resolves.toContain('bashaway-2k23-perfect-dish-0.0.0.0:8001->');
});

describe('should check installed dependencies', () => {
    test("no additional npm dependencies should be installed", async () => {
        await expect(dependencyCount()).resolves.toStrictEqual(5)
    });
});