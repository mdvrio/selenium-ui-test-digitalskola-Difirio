const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');

async function validateItemInCart() {
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

        // Tunggu hingga badge cart diperbarui
        await driver.wait(until.elementLocated(By.className('shopping_cart_badge')), 5000);

        // Klik ikon cart untuk masuk ke halaman cart
        await driver.findElement(By.className('shopping_cart_link')).click();

        // Tunggu hingga elemen item cart muncul
        await driver.wait(until.elementLocated(By.className('cart_item')), 5000);

        // Validasi bahwa item ada di cart
        let itemName = await driver.findElement(By.className('inventory_item_name')).getText();
        assert.strictEqual(itemName, 'Sauce Labs Backpack', 'Item in cart is not correct.');

        console.log("Item berhasil divalidasi di cart.");
    } catch (error) {
        console.error("Test gagal:", error.message);
    } finally {
        // Tutup browser
        await driver.quit();
    }
}

validateItemInCart();
