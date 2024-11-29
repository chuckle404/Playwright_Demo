import { Page } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) { }

    async getCartItems(): Promise<string[]> {
        return await this.page.$$eval('.inventory_item_name', items =>
            items.map(item => item.textContent!)
        );
    }

    async addItemToCart(itemName: string) {
        await this.page.click(`text=${itemName}`);
        await this.page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    }

    async removeItemFromCart(itemName: string) {
        await this.page.click(`text=${itemName}`);
        await this.page.click('[data-test="remove-sauce-labs-backpack"]');
    }

    async goToCart() {
        await this.page.click('#shopping_cart_container');
    }

    async proceedToCheckout() {
        await this.page.click('[data-test="checkout"]');
    }
}
