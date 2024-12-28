const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/loginpage');
const DashboardPage = require('./WebComponent/dashboardpage');
const assert = require('assert');

const fs = require('fs');
const screenshotDir = './screenshots/';
if(!fs.existsSync(screenshotDir)){
    fs.mkdirSync(screenshotDir, {recursive: true});
};

describe('SauceDemo Test', function() {
    this.timeout(60000);
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(async function() {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate();
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