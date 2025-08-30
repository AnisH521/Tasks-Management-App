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
