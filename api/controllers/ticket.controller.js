import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { getEndUserDashboard } from "../services/dashboard.service.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import {
  USER_ROLES,
} from "../constant/userMessage.js";
import {
  DETENTION_CATEGORIES,
  SECTIONS,
  TICKET_STATUSES,
  VALID_STATUSES,
} from "../constant/ticketMessage.js";

export const registerTicket = async (req, res) => {
  try {
    const { category, subCategory, complaintDescription, section } = req.body;

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
      (sub) => sub.code === subCategory
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

    const newTicket = new Ticket({
      category: category,
      subCategory: subCategory,
      complaintDescription: complaintDescription.trim(),
      department: currentUser.department,
      employeeName: currentUser.name,
      employeeID: currentUser.userID,
      assignedUser: USER_ROLES.CONTROLLER,
      section: section || "",
      status: "open",
    });

    const savedTicket = await newTicket.save();

    if (savedTicket) {
      return res.status(201).json({
        status: true,
        message: "Complaint registered successfully",
        data: {
          ticketId: savedTicket._id,
          category: savedTicket.category,
          department: savedTicket.department,
          employeeName: savedTicket.employeeName,
          status: savedTicket.status,
          submittedAt: savedTicket.createdAt,
        },
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

    // Get current user from middleware
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

    // Apply additional filters
    if (status) query.status = status;
    if (category) query.category = category;

    const complaints = await Ticket.find(query)
      .sort({ createdAt: -1 });

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
    const { ticketId, targetUserId} = req.body; 

    // 1. Basic Validation
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

    // 2. Fetch Data (Ticket, Current User, Target User)
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ status: false, message: "Ticket not found" });
    }

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ status: false, message: RESPONSE_MESSAGES.USER_NOT_FOUND });
    }

    // Check if target user exists
    const targetUser = await User.findOne({ userID: targetUserId });
    
    if (!targetUser) {
      return res.status(404).json({ status: false, message: "Target user not found" });
    }

    // 3. AUTHORIZATION LOGIC (The Core Requirement)
    let isAllowed = false;

    // --- CASE A: ADMIN (Has all power) ---
    if (currentUser.role === USER_ROLES.ADMIN) {
      isAllowed = true;
    }

    // --- CASE B: CONTROLLER ---
    else if (currentUser.role === USER_ROLES.CONTROLLER) {
      // 1. Own Department BO / Sr Scale / Jr Scale
      // check if target is in same department AND is a BO/Officer
      const isSameDept = targetUser.department === currentUser.department;
      const isTargetOfficer = targetUser.role === USER_ROLES.OFFICER; 
      
      // 2. Other Department Control
      const isTargetControl = targetUser.role === USER_ROLES.CONTROLLER;

      // 3. Issue Raiser
      // We check if targetUser._id matches ticket.raisedBy.id
      const isRaiser = ticket.employeeID === targetUser.userID;

      if ((isSameDept && isTargetOfficer) || isTargetControl || isRaiser) {
        isAllowed = true;
      }
    }

    // --- CASE C: BO (Branch Officer) ---
    else if (currentUser.role === USER_ROLES.OFFICER) {
      // 1. Above (Admin)
      const isTargetAdmin = targetUser.role === USER_ROLES.ADMIN;

      // 2. Other Department BO (or same dept BO)
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

    // 5. Perform the Forward Action
    // Update ticket assigned user/department/status
    ticket.assignedUser = targetUser.role;
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
        status: ticket.status
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
    const { message, status } = req.body;

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

    // Validate and add message if provided
    if (message !== undefined) {
      // Validate message length
      if (message && message.trim().length > 1000) {
        return res.status(400).json({
          status: false,
          message: "Message cannot exceed 1000 characters",
        });
      }
      updateFields.message = message ? message.trim() : "";
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = new Date();

    // Find and update ticket with only the provided fields
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      updateFields,
      { new: true, runValidators: true }
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
    const { ticketId, sender, message, senderRole } = req.body;

    // Validate required fields
    if (!ticketId) {
      return res.status(400).json({
        status: false,
        message: "Ticket ID is required",
      });
    }

    if (!sender || !message || !senderRole) {
      return res.status(400).json({
        status: false,
        message: "Sender, message, and senderRole are required",
      });
    }

    // Find the ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    // Create a new reply
    const newReply = {
      sender,
      message,
      senderRole,
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

export const getDashboardData = async (req, res) => {
  try {
    // Get current user from middleware
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    let dashboardData = {};

    // Build query based on user department
    let baseQuery = {};
    baseQuery.department = currentUser.department;
    dashboardData = await getEndUserDashboard(baseQuery, currentUser);

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.DASHBOARD_RETRIEVED,
      data: {
        userInfo: {
          name: `${currentUser.name} ${currentUser.surname}`,
          email: currentUser.email,
          role: currentUser.role,
          department: currentUser.department,
          isAdmin: currentUser.isAdmin,
          isJAG: currentUser.isJAG,
          isASTOfficer: currentUser.isASTOfficer,
          isSIC: currentUser.isSIC,
        },
        ...dashboardData,
      },
    });
  } catch (error) {
    console.error(RESPONSE_MESSAGES.DASHBOARD_ERROR, error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};
