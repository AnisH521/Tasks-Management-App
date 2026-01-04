import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { getEndUserDashboard } from "../services/dashboard.service.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import {
  USER_ROLES,
  VALID_DEPARTMENTS,
  VALIDATION_MESSAGES,
} from "../constant/userMessage.js";
import {
  VALID_CATEGORIES,
  VALID_STATUSES,
  VALIDATION_MESSAGE,
} from "../constant/ticketMessage.js";

// Controller to register a new ticket
// This function handles the registration of a new ticket by an end user
export const registerTicket = async (req, res) => {
  try {
    const { category, complaintDescription, location } = req.body;

    // Validate required fields
    if (!category || !complaintDescription || !location) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.REQUIRED_FIELDS,
      });
    }

    // Get current user from middleware
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // Validate department and categories
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        status: false,
        message: VALIDATION_MESSAGES.INVALID_CATEGORY,
      });
    }

    // Create new ticket
    const newTicket = new Ticket({
      category,
      complaintDescription: complaintDescription.trim(),
      department: currentUser.department,
      employeeName: currentUser.name,
      employeeEmail: currentUser.email,
      assignedUser: USER_ROLES.CONTROLLER,
      location: {
        section: location?.section?.trim() || "",
        address: location?.address?.trim() || "",
        landmark: location?.landmark?.trim() || "",
      },
      status: "open",
    });

    // Save ticket to database
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
      .populate("jagAssigned", "name surname email department")
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
    const { ticketId } = req.params;
    const { department, JAGEmail } = req.body;

    if (!JAGEmail || !department) {
      return res.status(400).json({
        status: false,
        message: "JAG email and department are required",
      });
    }

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    // Validate department
    if (!VALID_DEPARTMENTS.includes(department)) {
      return res.status(400).json({
        status: false,
        message: VALIDATION_MESSAGES.INVALID_DEPARTMENT,
      });
    }

    // Find ticket by ID and check existence
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: "Ticket not found",
      });
    }

    // Get current user from middleware  and check existence
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // check if JAG email is provided
    // check if user is JAG and provided department is same as jag department
    // Forward ticket to the specified department
    // Change the department and JAG assigned
    if (JAGEmail) {
      const user = await User.findOne({ email: JAGEmail });
      if (
        user &&
        user.role === USER_ROLES.JAG &&
        user.department === department
      ) {
        ticket.jagAssigned = user.name;
        ticket.jagAssignedDepartment = user.department;
        ticket.jagEmail = user.email;
        ticket.department = department;
      } else {
        return res.status(400).json({
          status: false,
          message: "Invalid data provided",
        });
      }
    }
    await ticket.save();

    return res.status(200).json({
      status: true,
      message: "Ticket forwarded successfully and new JAG assigned",
      data: ticket,
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
          message: VALIDATION_MESSAGE.INVALID_STATUS,
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

// Controller to add a reply/chat message to a ticket
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
