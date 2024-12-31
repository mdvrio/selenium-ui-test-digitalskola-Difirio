const { Builder } = require('selenium-webdriver');
const LoginPage = require('../ProjectConfig/loginpage');
const DashboardPage = require('../ProjectConfig/dashboardpage');
const CartPage = require('../ProjectConfig/cart');
const CheckoutPage = require('../ProjectConfig/checkout');
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

describe('SauceDemo Checkout Test [login] #Regression', function () {
    this.timeout(60000);
    let driver;
    let options;

    before(async function () {
        this.timeout(30000);

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

    it('should complete the checkout process successfully', async function () {
        const dashboardPage = new DashboardPage(driver);
        const cartPage = new CartPage(driver);
        const checkoutPage = new CheckoutPage(driver);

        // Add the first item to the cart
        const firstItemAddButton = await driver.findElement({ css: '.inventory_item:nth-child(1) .btn_inventory' });
        await firstItemAddButton.click();

        // Navigate to cart
        await cartPage.openCart();

        // Start the checkout process
        await checkoutPage.startCheckout();

        // Enter checkout information
        await checkoutPage.enterCheckoutInfo('John', 'Doe', '12345');

        // Complete the checkout process
        const confirmationMessage = await checkoutPage.completeCheckout();

        // Validate the confirmation message
        assert.strictEqual(
            confirmationMessage,
            'Thank you for your order!',
            'Expected confirmation message to be "Thank you for your order!"'
        );
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
