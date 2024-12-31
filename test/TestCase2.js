const { Builder } = require('selenium-webdriver');
const LoginPage = require('../ProjectConfig/loginpage');
const assert = require('assert');
require('dotenv').config();

const browser = process.env.BROWSER || 'chrome'; // Default ke 'chrome' jika tidak ada ENV
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const fs = require('fs');
const screenshotDir = './screenshotsProjectConfig/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('SauceDemo Test [login]', function () {
    this.timeout(60000);
    let driver;
    let options;

    before(async function () {
        this.timeout(30000);

        switch (browser.toLowerCase()) {
            case 'firefox':
                const firefox = require('selenium-webdriver/firefox');
                options = new firefox.Options();
                options.addArguments('--headless');
                driver = await new Builder()
                    .forBrowser('firefox')
                    .setFirefoxOptions(options)
                    .build();
                break;

            case 'edge':
                const edge = require('selenium-webdriver/edge');
                const edgeService = new edge.ServiceBuilder();
                options = new edge.Options();
                options.addArguments('--headless');
                driver = await new Builder()
                    .forBrowser('edge')
                    .setEdgeOptions(options)
                    .setEdgeService(edgeService)
                    .build();
                break;

            case 'chrome':
            default:
                const chrome = require('selenium-webdriver/chrome');
                options = new chrome.Options();
                options.addArguments('--headless');
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
                break;
        }
    });

    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login('asdf', 'asdffg'); // Login dengan kredensial tidak valid
    });

    it('Error message appears for invalid credential', async function () {
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(
            errorMessage,
            'Epic sadface: Username and password do not match any user in this service',
            'Expected error message doesn\'t match'
        );
    });

    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
