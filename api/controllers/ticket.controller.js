import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import { USER_ROLES } from "../constant/userMessage.js";
import {
  DETENTION_CATEGORIES,
  SECTIONS,
  TICKET_STATUSES,
  VALID_STATUSES,
} from "../constant/ticketMessage.js";

export const registerTicket = async (req, res) => {
  try {
    const { category, subCategory, complaintDescription, section, train_NO } =
      req.body;

    if (!category || !subCategory || !complaintDescription || !section) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.REQUIRED_FIELDS,
      });
    }

    if (!SECTIONS.includes(section)) {
      return res.status(400).json({
        status: false,
        message: "Invalid Section provided.",
      });
    }

    const selectedCategory = DETENTION_CATEGORIES[category];

    if (!selectedCategory) {
      return res.status(400).json({
        status: false,
        message: "Invalid Category Code.",
      });
    }

    const isValidSubCategory = selectedCategory.subcategories.some(
      (sub) => sub.code === subCategory,
    );

    if (!isValidSubCategory) {
      return res.status(400).json({
        status: false,
        message: `Invalid SubCategory '${subCategory}' for Category '${category}'.`,
      });
    }

    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // find a controller in the same department
    // if no controller found, return error
    const controller = await User.findOne({
      department: currentUser.department,
      role: USER_ROLES.CONTROLLER,
    });

    if (!controller) {
      return res.status(404).json({
        status: false,
        message: `No controller found in department ${currentUser.department}.`,
      });
    }

    const newTicket = new Ticket({
      category: category,
      subCategory: subCategory,
      complaintDescription: complaintDescription.trim(),
      train_NO: train_NO || "",
      department: currentUser.department,
      employeeName: currentUser.name,
      employeeID: currentUser.userID,
      assignedUser: controller.userID,
      section: section || "",
      status: "open",
    });

    const savedTicket = await newTicket.save();

    if (savedTicket) {
      return res.status(201).json({
        status: true,
        message: "Complaint registered successfully",
        data: newTicket,
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Failed to register complaint",
      });
    }
  } catch (error) {
    console.error("Error registering complaint:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getComplaints = async (req, res) => {
  try {
    const { status, category } = req.body;

    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Build query based on user role
    // End users only see complaints they submitted (matched by email)
    // SIC users see complaints that are assigned to them
    let query = {};

    query.department = currentUser.department;
    query.assignedUser = currentUser.userID;

    // Apply additional filters
    if (status) query.status = status;
    if (category) query.category = category;

    const complaints = await Ticket.find(query).sort({ createdAt: -1 });

    const totalCount = await Ticket.countDocuments(query);

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.COMPLAINT_RETRIEVED,
      totalCount: totalCount,
      data: complaints,
      userInfo: {
        email: currentUser.email,
        role: currentUser.role,
        department: currentUser.department,
      },
    });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate ticketId format
    if (!ticketId) {
      return res.status(400).json({
        status: false,
        message: "ticket ID not provided",
      });
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    // Find ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ticket retrieved successfully",
      data: ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const forwardComplaint = async (req, res) => {
  try {
    const { ticketId, targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        status: false,
        message: "Target User ID is required to forward.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res
        .status(404)
        .json({ status: false, message: "Ticket not found" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res
        .status(404)
        .json({ status: false, message: RESPONSE_MESSAGES.USER_NOT_FOUND });
    }
    const targetUser = await User.findOne({ userID: targetUserId });

    if (!targetUser) {
      return res
        .status(404)
        .json({ status: false, message: "Target user not found" });
    }

    let isAllowed = false;

    if (currentUser.role === USER_ROLES.ADMIN) {
      isAllowed = true;
    } else if (currentUser.role === USER_ROLES.CONTROLLER) {
      const isSameDept = targetUser.department === currentUser.department;
      const isTargetOfficer = targetUser.role === USER_ROLES.OFFICER;

      const isTargetControl = targetUser.role === USER_ROLES.CONTROLLER;

      const isRaiser = ticket.employeeID === targetUser.userID;

      if ((isSameDept && isTargetOfficer) || isTargetControl || isRaiser) {
        isAllowed = true;
      }
    } else if (currentUser.role === USER_ROLES.OFFICER) {
      const isTargetAdmin = targetUser.role === USER_ROLES.ADMIN;

      const isTargetBO = targetUser.role === USER_ROLES.OFFICER;

      if (isTargetAdmin || isTargetBO) {
        isAllowed = true;
      }
    }

    // 4. Final Decision
    if (!isAllowed) {
      return res.status(403).json({
        status: false,
        message: `You are not authorized to forward tickets to ${targetUser.role} in ${targetUser.department}.`,
      });
    }

    ticket.assignedUser = targetUser.userID;
    ticket.department = targetUser.department;
    ticket.status = TICKET_STATUSES.FORWARDED;

    await ticket.save();

    return res.status(200).json({
      status: true,
      message: `Ticket forwarded successfully to ${targetUser.username}`,
      data: {
        ticketId: ticket._id,
        assignedTo: targetUser.username,
        department: ticket.department,
        status: ticket.status,
      },
    });
  } catch (error) {
    console.error("Error forwarding ticket:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    // Check if at least one field is provided
    if (!status) {
      return res.status(400).json({
        status: false,
        message: "At least one field (status) must be provided for update",
      });
    }

    // Build update object dynamically
    const updateFields = {};

    // Validate and add status if provided
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          status: false,
          message: "validation error",
        });
      }
      updateFields.status = status;
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = new Date();

    // Find and update ticket with only the provided fields
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateFields,
      { new: true, runValidators: true },
    );

    if (!updatedTicket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: updateFields.message,
      data: {
        ticketId: updatedTicket._id,
        category: updatedTicket.category,
        department: updatedTicket.department,
        status: updatedTicket.status,
        employeeName: updatedTicket.employeeName,
        updatedAt: updatedTicket.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const addReplyToTicket = async (req, res) => {
  try {
    const { ticketId, message } = req.body;

    // Validate required fields
    if (!ticketId) {
      return res.status(400).json({
        status: false,
        message: "Ticket ID is required",
      });
    }

    if (!message) {
      return res.status(400).json({
        status: false,
        message: "Message is required",
      });
    }

    // Find the ticket
    // Find current user
    const ticket = await Ticket.findById(ticketId);
    const currentUser = await User.findById(req.user.userId);

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    // Create a new reply
    const newReply = {
      sender: currentUser.userID,
      message: message,
      senderRole: currentUser.role,
      timestamp: new Date(),
    };

    ticket.replies.push(newReply);

    await ticket.save();

    return res.status(200).json({
      status: true,
      message: "Reply added successfully",
      data: newReply,
    });
  } catch (error) {
    console.error("Error adding reply:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    // Find and delete the ticket
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Ticket deleted successfully",
      data: deletedTicket,
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};
