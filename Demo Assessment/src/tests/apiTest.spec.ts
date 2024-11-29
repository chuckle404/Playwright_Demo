import { test, expect } from '@playwright/test';
import { config } from '../config/config';
import { logger } from '../../logger';
import { handleError } from '../../errorHandler';

test.describe('API Testing for Products', () => {
    const baseURL = config.dummyjson;

    test('GET /products - Validate response schema and data', async ({ request: apiRequest }) => {
        try {
            logger.info('Sending GET request to /products');
            const response = await apiRequest.get(`${baseURL}/products`);
            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            // Validating response schema and data
            expect(responseBody).toHaveProperty('products');
            expect(responseBody).toHaveProperty('total');
            expect(responseBody).toHaveProperty('limit');
            expect(Array.isArray(responseBody.products)).toBe(true);

            const firstProduct = responseBody.products[0];
            expect(firstProduct).toHaveProperty('id');
            expect(firstProduct).toHaveProperty('title');
            expect(firstProduct).toHaveProperty('price');
            expect(firstProduct).toHaveProperty('description');

            // Type checks for product fields
            expect(typeof firstProduct.id).toBe('number');
            expect(typeof firstProduct.title).toBe('string');
            expect(typeof firstProduct.price).toBe('number');
            expect(typeof firstProduct.description).toBe('string');

            logger.info('GET /products response validated successfully');
        } catch (error) {
            logger.error('Error during GET /products test');
            handleError(error);
        }
    });

    test('POST /products/add - Add a new product and validate response', async ({ request: apiRequest }) => {
        try {
            logger.info('Sending POST request to /products/add');
            const newProduct = {
                title: 'Test Product',
                description: 'This is a test product.',
                price: 99.99,
                category: 'electronics',
            };

            const response = await apiRequest.post(`${baseURL}/products/add`, {
                data: newProduct,
            });
            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            // Validating response schema and data
            expect(responseBody).toHaveProperty('id');
            expect(responseBody.title).toBe(newProduct.title);
            expect(responseBody.description).toBe(newProduct.description);
            expect(responseBody.price).toBe(newProduct.price);
            expect(responseBody.category).toBe(newProduct.category);

            // Type checks for new product fields
            expect(typeof responseBody.id).toBe('number');
            expect(typeof responseBody.title).toBe('string');
            expect(typeof responseBody.price).toBe('number');
            expect(typeof responseBody.description).toBe('string');
            expect(typeof responseBody.category).toBe('string');

            logger.info('POST /products/add validated successfully');
        } catch (error) {
            logger.error('Error during POST /products/add test');
            handleError(error);
        }
    });

    test('GET /products - Handle error scenarios', async ({ request: apiRequest }) => {
        try {
            logger.info('Sending Invalid Endpoint request');
            const invalidEndpoint = `${baseURL}/products-invalid`;

            const response = await apiRequest.get(invalidEndpoint);
            expect(response.status()).toBe(404);

            // Check if body exists before parsing
            const responseBody = await response.text();
            if (responseBody) {
                const jsonResponse = JSON.parse(responseBody);
                expect(jsonResponse).toHaveProperty('message');
                expect(jsonResponse.message).toBe('Route not found');
            } else {
                logger.warn('No response body returned for invalid endpoint');
            }

            logger.info('Invalid Endpoint request validated successfully');
        } catch (error) {
            logger.error('Error during Invalid Endpoint request test');
            handleError(error);
        }
    });

    test('POST /products/add - Handle invalid input and expect rejection', async ({ request: apiRequest }) => {
        try {
            logger.info('Invalid Input for Post /products/add request');

            // Define the invalid product data
            const invalidProduct = {
                title: '', // Invalid title (empty string)
                price: -1, // Invalid price (negative value)
                description: 'This is an invalid product.', // Description remains valid
                category: 'electronics', // Category remains valid
            };

            // Sending POST request with invalid product data
            const response = await apiRequest.post(`${baseURL}/products/add`, {
                data: invalidProduct,
            });

            // We expect the response to be 400 or 422 for invalid input
            expect(response.status()).toBeGreaterThanOrEqual(400);
            expect(response.status()).toBeLessThan(500);

            // Parse the response body to check for validation error
            const responseBody = await response.json();

            // We expect an error message in the response indicating invalid input
            expect(responseBody).toHaveProperty('error');
            expect(responseBody.error).toContain('Invalid');

            logger.info('POST /products/add with invalid input correctly rejected');
        } catch (error) {
            logger.error('Error during Invalid Input for Post /products/add request test');
            handleError(error);
        }
    });

});
