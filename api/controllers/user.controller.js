import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { createJWT } from "../util/createJWT.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import { USER_ROLES } from "../constant/userMessage.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, department, password, role, isAdmin, isSIC } =
      req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !department ||
      !password ||
      !role ||
      isAdmin === undefined ||
      isSIC === undefined
    ) {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.REQUIRED_FIELDS });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: RESPONSE_MESSAGES.USER_EXISTS });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      department,
      password,
      role,
      isAdmin,
      isSIC,
    });

    // Save to database
    const savedUser = await newUser.save();

    if (savedUser) {
      isAdmin ? createJWT(res, savedUser._id) : null;

      savedUser.password = undefined;
      return res.status(201).json({
        message: RESPONSE_MESSAGES.COMPLAINT_REGISTERED,
        user: savedUser,
      });
    } else {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_ERROR });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: RESPONSE_MESSAGES.INTERNAL_ERROR });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: RESPONSE_MESSAGES.UNAUTHORIZED });
  }

  const isMatch = await user.matchPassword(password);

  if (user && isMatch) {
    createJWT(res, user._id);

    user.password = undefined;

    res.status(200).json(user);
  } else {
    return res
      .status(401)
      .json({ status: false, message: RESPONSE_MESSAGES.UNAUTHORIZED });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: RESPONSE_MESSAGES.SUCCESS });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: RESPONSE_MESSAGES.INTERNAL_ERROR });
  }
};

export const getAllEndUsers = async (req, res) => {
  try {
    // Find all users with role 'endUser' and exclude sensitive fields
    const endUsers = await User.find({
      role: USER_ROLES.END_USER,
    }).select("-password -__v");

    if (!endUsers || endUsers.length === 0) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: endUsers.length,
      data: endUsers,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.INVALID_ID_FORMAT,
      });
    }

    // Find user by ID and exclude password
    const user = await User.findById(id).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.USER_RETRIEVED,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const getAllSIC = async (req, res) => {
  try {
    // Find all users with role 'SIC' and exclude sensitive fields
    const sicUsers = await User.find({
      role: USER_ROLES.SIC,
    }).select("-password -__v");

    if (!sicUsers || sicUsers.length === 0) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.SIC_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: sicUsers.length,
      data: sicUsers,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.INVALID_ID_FORMAT,
      });
    }

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};
