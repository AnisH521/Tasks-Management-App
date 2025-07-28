import os from 'os';
import config from 'config';

/**
 * Health Metrics Utility Module
 * 
 * This module provides utility functions to retrieve system and application health metrics.
 * It gathers information about the operating system and the application's runtime environment.
 */

export default {
    /**
     * Get System Health Metrics
     * 
     * @function getSystemHealth
     * @returns {Object} System health data including CPU usage, total memory, and free memory.
     * 
     * @example
     * // Example response:
     * {
     *   "cpuUsage": [0.24, 0.22, 0.21],
     *   "totalMemory": "8192.00 MB",
     *   "freeMemory": "2048.50 MB"
     * }
     * 
     * @description
     * - `cpuUsage`: Average CPU load over the last 1, 5, and 15 minutes (retrieved using `os.loadavg()`).
     * - `totalMemory`: Total system memory in megabytes (retrieved using `os.totalmem()`).
     * - `freeMemory`: Free system memory in megabytes (retrieved using `os.freemem()`).
     */
    getSystemHealth: () => {
        return {
            cpuUsage: os.loadavg(),
            totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
            freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB` 
        }
    },
    /**
    * Get Application Health Metrics
    * 
    * @function getApplicationHealth
    * @returns {Object} Application health data including environment, uptime, and memory usage.
    * 
    * @example
    * // Example response:
    * {
    *   "environment": "production",
    *   "upTime": "1234.56 Second",
    *   "memoryUsage": {
    *     "heapTotal": "64.00 MB",
    *     "heapUsed": "32.50 MB"
    *   }
    * }
    * 
    * @description
    * - `environment`: Current application environment (e.g., "development", "production").
    * - `upTime`: Application uptime in seconds (retrieved using `process.uptime()`).
    * - `memoryUsage`: Memory usage details for the Node.js process:
    *   - `heapTotal`: Total memory allocated for the heap (in megabytes).
    *   - `heapUsed`: Memory currently used in the heap (in megabytes).
    */
    getApplicationHealth: () => {
        return {
            environment: config.get("env"),
            upTime: `${process.uptime().toFixed(2)} Second`,
            memoryUsage: {
                heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
                heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
            }
        }
    },
}