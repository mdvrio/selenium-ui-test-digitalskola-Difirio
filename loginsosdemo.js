const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

async function saucedemoLoginTest() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get('https://www.saucedemo.com/');
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('secret_sauce');
        await driver.findElement(By.css('input[value="Login"]')).click();
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, 'Title does not include "Swag Labs"');
        let menuButton = await driver.findElement(By.id('react-burger-menu-btn'));
        assert.strictEqual(await menuButton.isDisplayed(), true, 'Menu button is not visible');
        
    } finally {
        await driver.quit();
    }
}
saucedemoLoginTest();