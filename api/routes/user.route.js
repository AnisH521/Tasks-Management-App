import express from "express";
import {
  deleteUser,
  getAllControlUsers,
  getAllOfficers,
  getAllSupervisors,
  getForwardableUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { isAdminRoute, protectedRoute } from "../middleware/authMiddleware.js";

// Express Router instance
export const userRouter = express.Router();

userRouter.route("/register").post(registerUser);

// userRouter.route("/register").post(protectedRoute, isAdminRoute, registerUser);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(logoutUser);

userRouter
  .route("/getAllOfficers")
  .get(protectedRoute, getAllOfficers);

userRouter.route("/getAllSupervisors").get(protectedRoute, getAllSupervisors);
userRouter.route("/getAllControlUsers").get(protectedRoute, getAllControlUsers);

userRouter.route("/getForwardableUsers").post(protectedRoute, getForwardableUsers);

userRouter.route("/getUserById").get(protectedRoute, getUserById);

userRouter
  .route("/deleteUser")
  .delete(protectedRoute, deleteUser);
