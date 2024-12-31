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

describe('SauceDemo Test [login]', function() {
    this.timeout(60000);
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
});

    beforeEach(async function() {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login('asdf', 'asdffg');
    });

    it('Error message appears for invalid credential', async function() {
        const loginPage = new LoginPage(driver);
        const errorMessage = await loginPage.getErrorMessage();
        assert.strictEqual(errorMessage, 'Epic sadface: Username and password do not match any user in this service', 'Expected error message doesnt match');
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