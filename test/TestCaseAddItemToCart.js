const { Builder } = require('selenium-webdriver');
const LoginPage = require('../ProjectConfig/loginpage');
const DashboardPage = require('../ProjectConfig/dashboardpage');
const CartPage = require('../ProjectConfig/cart');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config();

const browser = process.env.BROWSER;
const baseUrl = process.env.BASE_URL;
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const screenshotDir = './screenshotsProjectConfig/';
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

describe('SauceDemo Add to Cart Test [login] #Regression', function () {
    this.timeout(60000);
    let driver;
    let options;

    before(async function () {
        this.timeout(30000); // Memberikan waktu tambahan untuk inisialisasi

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
                const chrome = require('selenium-webdriver/chrome');
                options = new chrome.Options();
                options.addArguments('--headless');
                driver = await new Builder()
                    .forBrowser('chrome')
                    .setChromeOptions(options)
                    .build();
                break;

            default:
                throw new Error(`Browser "${browser}" tidak didukung!`);
        }
    });

    beforeEach(async function () {
        const loginPage = new LoginPage(driver);
        await loginPage.navigate(baseUrl);
        await loginPage.login(username, password);
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
        if (driver) {
            await driver.quit();
        }
    });
});
