import express from "express";
import { isSICRoute, protectedRoute } from "../middleware/authMiddleware.js";
import {
  addReplyToTicket,
  deleteTicket,
  forwardComplaint,
  getComplaints,
  getComplaintsWhoRegistered,
  getTicketById,
  registerTicket,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

// Create an Express Router instance
export const ticketRouter = express.Router();

ticketRouter.route("/register").post(protectedRoute, registerTicket);

ticketRouter.route("/get-all").post(protectedRoute, getComplaints);

ticketRouter.route("/get-registered-complaints").get(protectedRoute, getComplaintsWhoRegistered);

ticketRouter.route("/get/:ticketId").get(protectedRoute, getTicketById);

ticketRouter.route("/update/:ticketId").put(protectedRoute, updateTicketStatus);

ticketRouter.route("/forward").put(protectedRoute, forwardComplaint);

ticketRouter.route("/add-remarks").post(protectedRoute, addReplyToTicket)

ticketRouter
  .route("/delete/:ticketId")
  .delete(protectedRoute, isSICRoute, deleteTicket);
