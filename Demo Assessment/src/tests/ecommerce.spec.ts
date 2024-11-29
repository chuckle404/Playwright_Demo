import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { logger } from '../../logger';
import { handleError } from '../../errorHandler';
import { credentials } from '../config/credentials'

test.describe('E-commerce Functionality Tests', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(credentials.standardUser, credentials.password); // Perform login before each test
    });

    test('Product Sorting - Price High to Low', async ({ page }) => {
        try {
            logger.info('Starting the test for Sorting Price High to Low');
            const homePage = new HomePage(page);

            await homePage.sortProducts('Price (high to low)');
            const prices = await homePage.getProductPrices();

            // Assert prices are sorted in descending order
            expect(prices).toEqual(prices.slice().sort((a, b) => b - a));
            logger.info('Sorting is successfully tested for Product Price High to Low');
        } catch (error) {
            logger.error('Error during Product Sorting Price High to Low test');
            handleError(error);
        }
    });

    test('Product Sorting - Name A to Z', async ({ page }) => {
        try {
            logger.info('Starting the test for Sorting Name A to Z');
            const homePage = new HomePage(page);

            await homePage.sortProducts('Name (A to Z)');
            const names = await homePage.getProductNames();

            // Assert names are sorted alphabetically
            expect(names).toEqual(names.slice().sort());
            logger.info('Sorting is successfully tested for Product Name A to Z');
        } catch (error) {
            logger.error('Error during Product Sorting by Name A to Z test');
            handleError(error);
        }
    });

    test('Add Multiple Items to Cart', async ({ page }) => {
        try {
            logger.info('Starting the test for Adding multiple items to cart');
            const homePage = new HomePage(page);
            const cartPage = new CartPage(page);

            await homePage.addProductToCart('Sauce Labs Backpack');
            await homePage.addProductToCart('Sauce Labs Bolt T-Shirt');

            await cartPage.goToCart();

            const cartItems = await cartPage.getCartItems();
            expect(cartItems).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt']);
            logger.info('Successfully added multiple items to cart ');
        } catch (error) {
            logger.error('Error during adding multiple items to cart test');
            handleError(error);
        }
    });

    test('Remove Items from Cart', async ({ page }) => {
        try {
            logger.info('Starting the test for removing items from cart');
            const homePage = new HomePage(page);
            const cartPage = new CartPage(page);

            await homePage.addProductToCart('Sauce Labs Backpack');
            await homePage.removeProductFromCart('Sauce Labs Backpack');

            await cartPage.goToCart();

            const cartItems = await cartPage.getCartItems();
            expect(cartItems).toEqual([]);
            logger.info('Successfully removed items from cart');
        } catch (error) {
            logger.error('Error during removing items from cart test');
            handleError(error);
        }
    });

    test('Complete Checkout Process', async ({ page }) => {
        try {
            logger.info('Starting the test for validating Complete Checkout process');
            const homePage = new HomePage(page);
            const cartPage = new CartPage(page);
            const checkoutPage = new CheckoutPage(page);

            await homePage.addProductToCart('Sauce Labs Backpack');
            await homePage.goBackToProducts();
            await cartPage.goToCart();
            await cartPage.proceedToCheckout();

            await checkoutPage.enterCheckoutDetails('John', 'Doe', '12345');
            const orderConfirmation = await checkoutPage.completeCheckout();
            const deliveryConfirmation = await checkoutPage.deliveryTextConfirmation();
            expect(orderConfirmation).toContain('Thank you for your order!');
            expect(deliveryConfirmation).toContain('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
            logger.info('Successfully Validated the complete checkout process');
        } catch (error) {
            logger.error('Error during the checkout process test');
            handleError(error);
        }
    });
});
