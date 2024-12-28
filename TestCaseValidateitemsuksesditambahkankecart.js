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

describe('SauceDemo Validate Item in Cart Test', function () {
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

    it('should validate item successfully added to cart', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);

        // Select the first item's name and price
        const firstItemNameElement = await driver.findElement({ css: '.inventory_item:nth-child(1) .inventory_item_name' });
        const firstItemPriceElement = await driver.findElement({ css: '.inventory_item:nth-child(1) .inventory_item_price' });
        const firstItemName = await firstItemNameElement.getText();
        const firstItemPrice = await firstItemPriceElement.getText();

        // Add the first item to the cart
        const firstItemAddButton = await driver.findElement({ css: '.inventory_item:nth-child(1) .btn_inventory' });
        await firstItemAddButton.click();

        // Open cart and validate item details
        await cartPage.openCart();
        const cartItems = await cartPage.getCartItems();

        assert.strictEqual(cartItems.length, 1, 'Cart should contain 1 item');
        assert.strictEqual(cartItems[0].name, firstItemName, 'Item name in cart should match the item added');
        assert.strictEqual(cartItems[0].price, firstItemPrice, 'Item price in cart should match the item added');
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
