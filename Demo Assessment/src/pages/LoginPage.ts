import { Page } from '@playwright/test';
import { config } from '../config/config';

export class LoginPage {
    constructor(private page: Page) { }

    async navigate() {
        await this.page.goto(config.saucedemo);
    }

    async login(username: string, password: string) {
        await this.page.fill('#user-name', username);
        await this.page.fill('#password', password);
        await this.page.click('#login-button');
    }

    async getErrorMessage(): Promise<string> {
        const errorText = await this.page.textContent('[data-test="error"]');
        return errorText ?? '';
    }
}
