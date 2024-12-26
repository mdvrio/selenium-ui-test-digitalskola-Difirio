const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

async function addItemToCart() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Buka halaman SauceDemo
        await driver.get('https://www.saucedemo.com/');
        
        // Masukkan username dan password
        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.css('input[placeholder="Password"]')).sendKeys('secret_sauce');
        
        // Klik tombol Login
        await driver.findElement(By.css('input[value="Login"]')).click();
        
        // Tunggu hingga elemen dashboard muncul
        await driver.wait(until.elementLocated(By.xpath("//div[@class='app_logo']")), 5000);

        // Klik tombol "Add to Cart" untuk item pertama
        let addToCartButton = await driver.findElement(By.xpath("//button[text()='Add to cart']"));
        await addToCartButton.click();
        
        // Tunggu hingga tombol berubah menjadi "Remove"
        await driver.wait(until.elementLocated(By.xpath("//button[text()='Remove']")), 5000);

        // Validasi bahwa item telah ditambahkan ke cart
        let cartBadge = await driver.findElement(By.className('shopping_cart_badge')).getText();
        assert.strictEqual(cartBadge, '1', 'Cart badge is not updated correctly.');

        console.log("Item berhasil ditambahkan ke cart.");
    } catch (error) {
        console.error("Test gagal:", error.message);
    } finally {
        // Tutup browser
        await driver.quit();
    }
}

addItemToCart();
