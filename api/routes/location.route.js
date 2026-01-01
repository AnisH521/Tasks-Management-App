import express from "express";
import { isSICRoute, protectedRoute } from "../middleware/authMiddleware.js";

import {
  registerStation,
  getAllstations,
  deletestations
} from "../controllers/location.controller.js";

// Create an Express Router instance
export const locationRouter = express.Router();

// Define routes
locationRouter.post("/register", protectedRoute, registerStation);
locationRouter.get("/all", protectedRoute, getAllstations);
locationRouter.delete("/delete", protectedRoute, deletestations);