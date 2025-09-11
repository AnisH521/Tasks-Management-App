import express from "express";
import {
  deleteUser,
  getAllEndUsers,
  getAllJAG,
  getAllSIC,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { isAdminRoute, protectedRoute } from "../middleware/authMiddleware.js";

// Express Router instance
export const userRouter = express.Router();

userRouter.route("/register").post(protectedRoute, isAdminRoute, registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(logoutUser);

userRouter
  .route("/getEndUsers")
  .get(protectedRoute, isAdminRoute, getAllEndUsers);

userRouter.route("/getSICUsers").get(protectedRoute, isAdminRoute, getAllSIC);
userRouter.route("/getJAGUsers").get(protectedRoute, getAllJAG);

userRouter.route("/:id").get(protectedRoute, isAdminRoute, getUserById);

userRouter
  .route("/delete/:id")
  .delete(protectedRoute, isAdminRoute, deleteUser);
