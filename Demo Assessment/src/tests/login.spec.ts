import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { logger } from '../../logger';
import { handleError } from '../../errorHandler';
import { credentials } from '../config/credentials';

test.describe('Authentication Tests', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate(); // Navigate to the login page before each test
  });

  test('Successful Login', async ({ page }) => {
    try {
      logger.info('Navigating to SauceDemo login page');
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      await loginPage.login(credentials.standardUser, credentials.password);
      const homePageLoaded = await homePage.isLoaded();

      expect(homePageLoaded).toBeTruthy();
      expect(page.url()).toContain('/inventory.html');
    } catch (error) {
      logger.error('Error during login test');
      handleError(error);
    }
  });

  test('Invalid Login - Incorrect Username', async ({ page }) => {
    try {
      logger.info('Testing invalid Username login');
      const loginPage = new LoginPage(page);

      await loginPage.login(credentials.invalidUser, credentials.password); // Invalid username
      const errorMessage = await loginPage.getErrorMessage();

      expect(errorMessage).toContain('Username and password do not match any user in this service'); // Assert error message
      logger.info('Invalid Username login handled successfully');
    } catch (error) {
      logger.error('Error during invalid username login test');
      handleError(error);
    }
  });

  test('Invalid Login - Incorrect Password', async ({ page }) => {
    try {
      logger.info('Testing invalid Password login');
      const loginPage = new LoginPage(page);

      await loginPage.login(credentials.standardUser, credentials.invalidPassword); // Invalid password
      const errorMessage = await loginPage.getErrorMessage();

      expect(errorMessage).toContain('Username and password do not match any user in this service'); // Assert error message
      logger.info('Invalid Password login handled successfully');
    } catch (error) {
      logger.error('Error during invalid password login test');
      handleError(error);
    }
  });

  test('Logout Functionality', async ({ page }) => {
    try {
      logger.info('Testing Logout');
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      await loginPage.login(credentials.standardUser, credentials.password); // Successful login
      await homePage.logout(); // Perform logout action

      expect(page.url()).toBe('https://www.saucedemo.com/'); // Assert redirection to the login page
      logger.info('Logout handled successfully');
    } catch (error) {
      logger.error('Error during Logout test');
      handleError(error);
    }
  });

  test('Locked Out User Login', async ({ page }) => {
    try {
      logger.info('Testing Locked Out User login');
      const loginPage = new LoginPage(page);

      await loginPage.login(credentials.lockedOutUser, credentials.password); // Locked out user credentials
      const errorMessage = await loginPage.getErrorMessage();

      expect(errorMessage).toContain('Sorry, this user has been locked out.'); // Assert error message for locked-out user
      logger.info('Locked out user login test successfully');
    } catch (error) {
      logger.error('Error during Locked out user login test');
      handleError(error);
    }
  });
});
