import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import config from 'config';
import { connectDB } from "./util/connectionSetup.js";
import { errorHandler, routeNotFound } from "./middleware/errorHandler.js";
import { apiRouter } from "./routes/api.route.js";
import { userRouter } from "./routes/user.route.js";
import { ticketRouter } from "./routes/ticket.route.js";
import { seedDatabase } from "./seeder/databaseSeeder.js";

dotenv.config();

connectDB();
//await seedDatabase();

// Define the port from environment variables or default to 4000
// This allows the server to run on a specified port, useful for deployment or local development
const PORT = config.get("app.port") || 4000;

// Create an express application
const app = express();

// Middlewares

// Enable CORS with options from `corsOptions`
app.use(
  cors({
    origin: config.get("cors.allowedOrigins"),
    methods: config.get("method"),
    allowedHeaders: config.get("headers"),
    credentials: true,
  })
);
// Add cookie parser
app.use(cookieParser());

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Logging middleware for development
app.use(morgan("dev"));

// Routes
app.use("/api/v1", apiRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tickets", ticketRouter);

/**
 * Global Error Handler
 *
 * Handles application-wide errors.
 * Ensure this middleware is placed after all routes to catch unhandled errors.
 */
app.use(errorHandler);
app.use(routeNotFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
