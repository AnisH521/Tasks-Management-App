import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import quicker from "../util/quicker.js";

/**
 * Controller Module
 * 
 * This module defines controller functions for handling specific API endpoints.
 * It includes health checks and a self-check endpoint for the application.
 */

/**
 * Self Check Endpoint
 * 
 * Responds with a success message to indicate the API is functioning correctly.
 * 
 * @function self
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 * 
 * @example
 * // Example response:
 * {
 *   "message": "Success"
 * }
 * 
 * @description
 * This endpoint is a basic health check to verify the API's responsiveness.
 * - Status: 200 (Success)
 * - Message: Defined in `ResponseMessage.SUCCESS`
 * 
 * Logs errors using the `httpError` utility in case of failures.
 */
const self = async (req, res, next) => {
    try {
        httpResponse(req, res, 200, RESPONSE_MESSAGES.SUCCESS, {})
    } catch (err) {
        httpError(next, err, req, 500)
    }
};

/**
 * Health Check Endpoint
 * 
 * Responds with detailed health information about the application and system.
 * 
 * @function health
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @param {Function} next - The next middleware function
 * 
 * @example
 * // Example response:
 * {
 *   "message": "Success",
 *   "data": {
 *     "application": { ... },
 *     "system": { ... },
 *     "timestamp": 1675634340000
 *   }
 * }
 * 
 * @description
 * This endpoint provides a comprehensive health report:
 * - `application`: Application-specific health metrics, retrieved via `quicker.getApplicationHealth`.
 * - `system`: System-level health metrics, retrieved via `quicker.getSystemHealth`.
 * - `timestamp`: Current timestamp when the data was generated.
 * 
 * Logs errors using the `httpError` utility in case of failures.
 */
const health = (req, res, next) => {
    try {
        const healthData = {
            application: quicker.getApplicationHealth(),
            system: quicker.getSystemHealth(),
            timestamp: Date.now()
        }
        
        // Return response directly using Express res methods
        return res.status(200).json({
            success: true,
            message: "Health check successful",
            data: healthData
        });
        
    } catch (err) {
        // Pass error to Express error handling middleware
        return next(err);
    }
};


// Export the controller functions
export default {
    self,
    health
}