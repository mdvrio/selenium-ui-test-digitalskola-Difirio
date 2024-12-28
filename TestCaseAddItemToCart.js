const { Builder } = require('selenium-webdriver');
const LoginPage = require('./WebComponent/loginpage');
const DashboardPage = require('./WebComponent/dashboardpage');
const CartPage = require('./WebComponent/cart');
const assert = require('assert');
const fs = require('fs');

const screenshotDir = './screenshots/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('SauceDemo Add to Cart Test', function () {
    this.timeout(60000);
    let driver;

    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
    });

    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');
    });

    it('should add item to cart and validate item is in cart', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);

        // Add the first item to the cart
        const firstItemAddButton = await driver.findElement({ css: '.inventory_item:nth-child(1) .btn_inventory' });
        await firstItemAddButton.click();

        // Validate cart badge shows 1 item
        const cartCount = await cartPage.getCartItemCount();
        assert.strictEqual(cartCount, 1, 'Cart should contain 1 item');

        // Open cart and validate item is present
        await cartPage.openCart();
        const cartItems = await cartPage.getCartItems();
        assert.strictEqual(cartItems.length, 1, 'Cart should contain 1 item');
    });

    afterEach(async function () {
        const screenshot = await driver.takeScreenshot();
        const filepath = `${screenshotDir}${this.currentTest.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
        fs.writeFileSync(filepath, screenshot, 'base64');
    });

    after(async function () {
        await driver.quit();
    });
});
