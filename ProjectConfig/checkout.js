class CheckoutPage {
    constructor(driver) {
        this.driver = driver;
    }

    async startCheckout() {
        const checkoutButton = await this.driver.findElement({ css: '.checkout_button' });
        await checkoutButton.click();
    }

    async enterCheckoutInfo(firstName, lastName, postalCode) {
        await this.driver.findElement({ id: 'first-name' }).sendKeys(firstName);
        await this.driver.findElement({ id: 'last-name' }).sendKeys(lastName);
        await this.driver.findElement({ id: 'postal-code' }).sendKeys(postalCode);
        const continueButton = await this.driver.findElement({ css: '.cart_button' });
        await continueButton.click();
    }

    async completeCheckout() {
        const finishButton = await this.driver.findElement({ css: '.cart_button' });
        await finishButton.click();
        const confirmationMessage = await this.driver.findElement({ css: '.complete-header' }).getText();
        return confirmationMessage;
    }
}

module.exports = CheckoutPage;
