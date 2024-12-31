const { By } = require('selenium-webdriver');

class CartPage {
    constructor(driver) {
        this.driver = driver;
        this.cartItems = By.className('cart_item');
        this.cartBadge = By.className('shopping_cart_badge');
        this.cartButton = By.className('shopping_cart_link');
        this.itemName = By.className('inventory_item_name');
        this.itemPrice = By.className('inventory_item_price');
    }

    async openCart() {
        await this.driver.findElement(this.cartButton).click();
    }

    async getCartItemCount() {
        try {
            const badge = await this.driver.findElement(this.cartBadge);
            const itemCount = await badge.getText();
            return parseInt(itemCount, 10); // Convert text to number
        } catch (err) {
            return 0; // Return 0 if no badge exists
        }
    }

    async getCartItems() {
        const items = await this.driver.findElements(this.cartItems);
        return Promise.all(items.map(async (item) => {
            const name = await item.findElement(this.itemName).getText();
            const price = await item.findElement(this.itemPrice).getText();
            return { name, price };
        }));
    }
}

module.exports = CartPage;
