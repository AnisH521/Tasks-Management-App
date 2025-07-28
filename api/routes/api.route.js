import express from 'express';
import apiController from '../controllers/api.controller.js';

/**
 * API Router Module
 * 
 * This module defines routes for the API endpoints and connects them to their respective controller functions.
 * It uses the Express Router instance to group related routes and provides functionality for health checks.
 */

// Create an Express Router instance
export const apiRouter = express.Router();

/**
 * Route: Self Check
 * 
 * Endpoint: `/self`
 * Method: GET
 * 
 * @description
 * This route connects to the `self` controller function in `apiController`. 
 * It is used to perform a basic health check to verify the API's responsiveness.
 * 
 * @example
 * GET /self
 * Response: { "message": "Success" }
 */
apiRouter.route('/self')
    .get(apiController.self);

/**
 * Route: Health Check
 * 
 * Endpoint: `/health`
 * Method: GET
 * 
 * @description
 * This route connects to the `health` controller function in `apiController`.
 * It provides a detailed health report, including application and system health metrics.
 * 
 * @example
 * GET /health
 * Response: 
 * {
 *   "message": "Success",
 *   "data": {
 *     "application": { ... },
 *     "system": { ... },
 *     "timestamp": 1675634340000
 *   }
 * }
 */
apiRouter.route('/health')
    .get(apiController.health);