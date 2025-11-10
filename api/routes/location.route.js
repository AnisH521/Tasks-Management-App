import express from "express";
import { isSICRoute, protectedRoute } from "../middleware/authMiddleware.js";

import {
  registerSection,
  getAllSections,
  deleteSections
} from "../controllers/location.controller.js";

// Create an Express Router instance
export const locationRouter = express.Router();

// Define routes
locationRouter.post("/register", protectedRoute, registerSection);
locationRouter.get("/all", protectedRoute, getAllSections);
locationRouter.delete("/delete", protectedRoute, deleteSections);
