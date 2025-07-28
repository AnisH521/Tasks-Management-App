import { TICKET_STATUSES } from "../constant/ticketMessage.js";
import { Ticket } from "../models/ticket.model.js";

// End User Dashboard
export const getEndUserDashboard = async (baseQuery, user) => {
  const [totalTickets, statusCounts, categoryCounts] =
    await Promise.all([
      // Total tickets count
      Ticket.countDocuments(baseQuery),

      // Status-wise counts
      Ticket.aggregate([
        { $match: baseQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // Category-wise counts
      Ticket.aggregate([
        { $match: baseQuery },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),
    ]);

  return {
    summary: {
      totalTickets,
      openTickets: statusCounts.find((s) => s._id === "open")?.count || 0,
      forwardedTickets:
        statusCounts.find((s) => s._id === "forwarded")?.count || 0,
      closedTickets: statusCounts.find((s) => s._id === "closed")?.count || 0,
      rejectedTickets:
        statusCounts.find((s) => s._id === "rejected")?.count || 0,
    },
    statusBreakdown: statusCounts,
    categoryBreakdown: categoryCounts,
  };
};

// SIC Dashboard
export const getSICDashboard = async (baseQuery, user) => {
  const [
    totalTickets,
    statusCounts,
    categoryCounts,
  ] = await Promise.all([
    // Total tickets in department
    Ticket.countDocuments(baseQuery),

    // Status-wise counts
    Ticket.aggregate([
      { $match: baseQuery },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    // Category-wise counts
    Ticket.aggregate([
      { $match: baseQuery },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);

  return {
    summary: {
      totalTickets,
      openTickets: statusCounts.find((s) => s._id === TICKET_STATUSES.OPEN)?.count || 0,
      forwardedTickets:
        statusCounts.find((s) => s._id === TICKET_STATUSES.FORWARDED)?.count || 0,
      closedTickets: statusCounts.find((s) => s._id === TICKET_STATUSES.CLOSED)?.count || 0,
      rejectedTickets:
        statusCounts.find((s) => s._id === TICKET_STATUSES.REJECTED)?.count || 0
    },
    statusBreakdown: statusCounts,
    categoryBreakdown: categoryCounts,
  };
};

// Admin Dashboard
export const getAdminDashboard = async (user) => {
  const [
    totalTickets,
    statusCounts,
    categoryCounts,
    departmentCounts,
  ] = await Promise.all([
    // Total tickets across all departments
    Ticket.countDocuments({}),

    // Status-wise counts
    Ticket.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    // Category-wise counts
    Ticket.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),

    // Department-wise counts
    Ticket.aggregate([{ $group: { _id: "$department", count: { $sum: 1 } } }]),
  ]);

  return {
    summary: {
      totalTickets,
      openTickets: statusCounts.find((s) => s._id === "open")?.count || 0,
      forwardedTickets:
        statusCounts.find((s) => s._id === "forwarded")?.count || 0,
      closedTickets: statusCounts.find((s) => s._id === "closed")?.count || 0,
      rejectedTickets:
        statusCounts.find((s) => s._id === "rejected")?.count || 0,
    },
    statusBreakdown: statusCounts,
    categoryBreakdown: categoryCounts,
    departmentBreakdown: departmentCounts,
  };
};
