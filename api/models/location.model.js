import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    section: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Location = mongoose.model("Location", locationSchema);
