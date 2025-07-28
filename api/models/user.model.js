import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import { USER_ROLES, VALID_ROLES } from "../constant/userMessage.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    department: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: VALID_ROLES,
      default: USER_ROLES.END_USER,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSIC: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export const User = mongoose.model("User", userSchema);
