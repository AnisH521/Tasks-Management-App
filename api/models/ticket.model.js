import mongoose, { Schema } from "mongoose";

const replySchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    senderRole: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const ticketSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
    },

    subCategory: {
      type: String,
      required: true,
    },

    complaintDescription: {
      type: String,
      required: true,
      trim: true,
      maxLength: 6000,
    },

    train_NO: {
      type: String,
      required: false,
    },

    department: {
      type: String,
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeID: {
      type: String,
      required: true,
    },

    assignedUser: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["open", "forwarded", "closed", "rejected"],
      default: "open",
    },
    message: {
      type: String,
      required: false,
      trim: true,
      maxLength: 20000,
    },
    replies: {
      type: [replySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
