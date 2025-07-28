import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    category: {
      type: String,
      enum: ["Safety", "Non-Safety", "Asset-Failure"],
      required: true,
    },

    complaintDescription: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },

    department: {
      type: String,
      enum: ["Finance", "IT"],
      required: true,
    },

    employeeName: {
      type: String,
      required: true,
    },

    employeeEmail: {
      type: String,
      required: true,
    },

    location: {
      building: {
        type: String,
        required: false,
      },
      floor: {
        type: String,
        required: false,
      },
      room: {
        type: String,
        required: false,
      },
    },

    status: {
      type: String,
      enum: ["open", "forwarded", "closed", "rejected"],
      default: "open",
    },

    // SIC handling
    sicAssigned: {
      type: String,
      required: true,
    },
    sicAssignedDepartment: {
      type: String,
      required: false,
    },
    sicEmail: {
      type: String,
      required: false,
    },
    messageBySIC: {
      type: String,
      required: false,
      trim: true,
      maxLength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

export const Ticket = mongoose.model("Ticket", ticketSchema);
