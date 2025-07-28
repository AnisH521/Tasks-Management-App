import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model.js";
import { User } from "../models/user.model.js";
import { getAdminDashboard, getEndUserDashboard, getSICDashboard } from "../services/dashboard.service.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import { USER_ROLES, VALIDATION_MESSAGES } from "../constant/userMessage.js";

//Controller to register a new ticket
// This function handles the registration of a new ticket by an end user
export const registerTicket = async (req, res) => {
  try {
    const { category, complaintDescription, location, sicAssigned } = req.body;

    // Validate required fields
    if (!category || !complaintDescription || !sicAssigned || !location) {
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

    if (!VALID_DEPARTMENTS.includes(currentUser.department)) {
      return res.status(400).json({
        status: false,
        message: VALIDATION_MESSAGES.INVALID_DEPARTMENT,
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentUser.email)) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.INVALID_EMAIL,
      });
    }

    // find SIC by name
    const sicUser = await User.findOne({ name: sicAssigned, role: "SIC" });
    if (!sicUser) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.SIC_NOT_FOUND,
      });
    }

    // Create new ticket
    const newTicket = new Ticket({
      category,
      complaintDescription: complaintDescription.trim(),
      department: currentUser.department,
      employeeName: currentUser.name,
      employeeEmail: currentUser.email,
      location: {
        building: location?.building?.trim() || "",
        floor: location?.floor?.trim() || "",
        room: location?.room?.trim() || "",
      },
      status: "open",
      sicAssigned: sicAssigned,
      sicAssignedDepartment: sicUser.department,
      sicEmail: sicUser.email,
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

    if (currentUser.role === USER_ROLES.END_USER) {
      query.employeeEmail = currentUser.email;
    } else if (currentUser.isSIC) {
      query.sicEmail = currentUser.email;
    }

    // Apply additional filters
    if (status) query.status = status;
    if (category) query.category = category;

    const complaints = await Ticket.find(query)
      .populate("sicAssigned", "name surname email department")
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

export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { department, status } = req.body;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid ticket ID format",
      });
    }

    // Check if at least one field is provided
    if (!department && !status) {
      return res.status(400).json({
        status: false,
        message:
          "At least one field (department or status) must be provided for update",
      });
    }

    // Build update object dynamically
    const updateFields = {};

    // Validate and add status if provided
    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          status: false,
          message: VALIDATION_MESSAGES.INVALID_STATUS,
        });
      }
      updateFields.status = status;
    }

    // Validate and add department if provided
    if (department) {
      if (!VALID_DEPARTMENTS.includes(department)) {
        return res.status(400).json({
          status: false,
          message: VALIDATION_MESSAGES.INVALID_DEPARTMENT,
        });
      }
      updateFields.department = department;
    }

    // Validate and add messageBySIC if provided
    if (messageBySIC !== undefined) {
      // Validate messageBySIC length
      if (messageBySIC && messageBySIC.trim().length > 1000) {
        return res.status(400).json({
          status: false,
          message: "Message by SIC cannot exceed 1000 characters",
        });
      }

      updateFields.messageBySIC = messageBySIC ? messageBySIC.trim() : "";
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

    // Build response message based on what was updated
    let updateMessage = "Ticket updated successfully";
    const updatedFields = [];

    if (status) updatedFields.push("status");
    if (department) updatedFields.push("department");

    if (updatedFields.length > 0) {
      updateMessage = `Ticket ${updatedFields.join(
        " and "
      )} updated successfully`;
    }

    return res.status(200).json({
      status: true,
      message: updateMessage,
      data: {
        ticketId: updatedTicket._id,
        category: updatedTicket.category,
        department: updatedTicket.department,
        status: updatedTicket.status,
        employeeName: updatedTicket.employeeName,
        updatedAt: updatedTicket.updatedAt,
        updatedFields: updatedFields,
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
}

export const getDashboardData = async (req, res) => {
  try {
    // Get current user from middleware
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND
      });
    }

    let dashboardData = {};

    // Build query based on user role
    let baseQuery = {};
    
    if (currentUser.role === USER_ROLES.END_USER) {
      baseQuery.employeeEmail = currentUser.email;
      dashboardData = await getEndUserDashboard(baseQuery, currentUser);
    } 
    else if (currentUser.isSIC) {
      baseQuery.sicEmail = currentUser.email;
      dashboardData = await getSICDashboard(baseQuery, currentUser);
    }
    else if (currentUser.isAdmin) {
      dashboardData = await getAdminDashboard(currentUser);
    }

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
          isSIC: currentUser.isSIC
        },
        ...dashboardData
      }
    });

  } catch (error) {
    console.error(RESPONSE_MESSAGES.DASHBOARD_ERROR, error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR
    });
  }
};



