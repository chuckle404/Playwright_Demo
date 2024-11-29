import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) { }

  async isLoaded(): Promise<boolean> {
    return this.page.isVisible('.inventory_list');
  }

  async logout() {
    await this.page.click('#react-burger-menu-btn');
    await this.page.click('#logout_sidebar_link');
  }

  async sortProducts(option: string) {
    await this.page.selectOption('.product_sort_container', { label: option });
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.page.$$eval('.inventory_item_price', items =>
      items.map(item => parseFloat(item.textContent!.replace('$', '')))
    );
    return prices;
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.page.$$eval('.inventory_item_name', items =>
      items.map(item => item.textContent!)
    );
    return names;
  }

  async addProductToCart(productName: string) {
    await this.page.click(`text=${productName}`);
    await this.page.click('[data-test^="add-to-cart"]');
  }

  async goBackToProducts() {
    await this.page.click('[data-test^="back-to-products"]');
  }

  async removeProductFromCart(productName: string) {
    await this.page.click(`text=${productName}`);
    await this.page.click('[data-test^="remove"]');
  }
}
