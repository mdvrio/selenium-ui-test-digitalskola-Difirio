const { Builder } = require('selenium-webdriver');
const LoginPage = require('../ProjectConfig/loginpage');
const DashboardPage = require('../ProjectConfig/dashboardpage');
const assert = require('assert');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const fs = require('fs');
const screenshotDir = './screenshotsProjectConfig/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
};

describe('TestCase 1 [login] #Regression', function() {
    this.timeout(60000);
    let driver;

    // const chrome = require('selenium-webdriver/chrome');
    // options = new chrome.Options();
    // options.addArguments('--headless');

    // before(async function() {
    //     driver = await new Builder().forBrowser(browser).setChromeOptions(options).build();
    // });

    before(async function () {
        this.timeout(30000); // Memberikan waktu tambahan untuk inisialisasi
        let options;

        switch (browser.toLowerCase()) {
            case 'firefox':
                const firefox = require('selenium-webdriver/firefox');
                options = new firefox.Options();
                options.addArguments('--headless'); // Mode headless
                driver = await new Builder()
                    .forBrowser('firefox')
                    .setFirefoxOptions(options)
                    .build();
                break;

            case 'edge':
                const edge = require('selenium-webdriver/edge');
                const edgeService = new edge.ServiceBuilder(); // Konfigurasi layanan Edge
                options = new edge.Options();
                options.addArguments('--headless'); // Mode headless
                driver = await new Builder()
                    .forBrowser('edge')
                    .setEdgeOptions(options)
                    .setEdgeService(edgeService)
                    .build();
                break;

            case 'chrome':
                const chrome = require('selenium-webdriver/chrome');
                options = new chrome.Options();
                options.addArguments('--headless'); // Mode headless
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
                break;

            default:
                throw new Error(`Browser "${browser}" tidak didukung!`);
        }
    });

    beforeEach(async function() {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);
    });

    it('should login successfully and verify dashboard switchcase browser', async function() {
        const dashboardPage = new DashboardPage(driver);
        const title = await dashboardPage.isOnDashboard();
        assert.strictEqual(title, 'Products', 'Expected dashboard title to be Products');
    });

    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function() {
        await driver.quit();
});
});