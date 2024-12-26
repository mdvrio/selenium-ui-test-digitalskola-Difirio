const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

async function validateDashboardAfterLogin() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Buka halaman SauceDemo
        await driver.get('https://www.saucedemo.com/');
        
        // Masukkan username dan password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('secret_sauce');
        
        // Klik tombol Login
        await driver.findElement(By.css('input[value="Login"]')).click();
        
        // Tunggu hingga elemen dashboard tertentu muncul
        await driver.wait(until.elementLocated(By.xpath("//div[@class='app_logo']")), 5000);

        // Validasi bahwa user berada di dashboard
        let titleText = await driver.findElement(By.xpath("//div[@class='app_logo']")).getText();
        assert.strictEqual(titleText.includes('Swag Labs'), true, 'User is not on the dashboard.');

        console.log("User berhasil login dan berada di dashboard.");
    } catch (error) {
        console.error("Test gagal:", error.message);
    } finally {
        // Tutup browser
        await driver.quit();
    }
}

validateDashboardAfterLogin();
