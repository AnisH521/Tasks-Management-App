import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    station: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Location = mongoose.model("Location", locationSchema);
