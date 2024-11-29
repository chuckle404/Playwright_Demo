import { Page } from '@playwright/test';

export class CheckoutPage {
    constructor(private page: Page) { }

    async enterCheckoutDetails(firstName: string, lastName: string, zipCode: string) {
        await this.page.fill('[data-test="firstName"]', firstName);
        await this.page.fill('[data-test="lastName"]', lastName);
        await this.page.fill('[data-test="postalCode"]', zipCode);
        await this.page.click('[data-test="continue"]');
        await this.page.click('[data-test="finish"]');
    }

    async completeCheckout(): Promise<string> {
        const confirmationText = await this.page.textContent('.complete-header');
        return confirmationText ?? 'Order confirmation text not found';
    }
    
    async deliveryTextConfirmation(): Promise<string> {
        const confirmationText = await this.page.textContent('.complete-text');
        return confirmationText ?? 'Order confirmation text not found';
    }
}


