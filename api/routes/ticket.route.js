import express from 'express';
import { isSICRoute, protectedRoute } from '../middleware/authMiddleware.js';
import { deleteTicket, getComplaints, getDashboardData, getTicketById, registerTicket, updateTicketStatus } from '../controllers/ticket.controller.js';

// Create an Express Router instance
export const ticketRouter = express.Router();

ticketRouter.route("/register")
    .post(protectedRoute, registerTicket);

ticketRouter.route("/get-all")
    .get(protectedRoute, getComplaints);

ticketRouter.route("/get/:ticketId")
    .get(protectedRoute, getTicketById);

ticketRouter.route("/update/:ticketId")
    .put(protectedRoute, isSICRoute, updateTicketStatus);

ticketRouter.route("/delete/:ticketId")
    .delete(protectedRoute, isSICRoute, deleteTicket);

ticketRouter.route("/dashboard").get(protectedRoute, getDashboardData)