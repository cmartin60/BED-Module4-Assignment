// import the express application and type definition
import express, { Express } from "express";

import errorHandler from "./api/v1/middleware/errorHandler";

// initialize the express application
const app: Express = express();

// Interface for health check response
// An interface in TypeScript defines the structure or "shape" of an object.
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello World");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});


// needs to be used last
app.use(errorHandler);

export default app;