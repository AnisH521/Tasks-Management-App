import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.model.js";
import { createJWT } from "../util/createJWT.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import { USER_ROLES } from "../constant/userMessage.js";

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      department,
      password,
      role,
      isAdmin,
      isSIC,
      isASTOfficer,
      isJAG,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !department ||
      !password ||
      !role ||
      isAdmin === undefined ||
      isSIC === undefined ||
      isASTOfficer === undefined ||
      isJAG === undefined
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

    // check if user role and user role flag matches
    if (
      (isAdmin !== true && role == USER_ROLES.ADMIN) ||
      (isAdmin == true && role != USER_ROLES.ADMIN)
    ) {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INVALID_USER_ROLE });
    } else if (
      (isSIC !== true && role == USER_ROLES.SIC) ||
      (isSIC == true && role != USER_ROLES.SIC)
    ) {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INVALID_USER_ROLE });
    } else if (
      (isASTOfficer !== true && role == USER_ROLES.ASTOFFICER) ||
      (isASTOfficer == true && role != USER_ROLES.ASTOFFICER)
    ) {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INVALID_USER_ROLE });
    } else if (
      (isJAG !== true && role == USER_ROLES.JAG) ||
      (isJAG == true && role != USER_ROLES.JAG)
    ) {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INVALID_USER_ROLE });
    }

    // create unique userID
    const userID = uuidv4();

    // Create a new user
    const newUser = new User({
      name,
      email,
      department,
      userID,
      password,
      role,
      isAdmin,
      isSIC,
      isASTOfficer,
      isJAG,
    });

    // Save to database
    const savedUser = await newUser.save();

    if (savedUser) {
      isAdmin ? createJWT(res, savedUser._id) : null;

      savedUser.password = undefined;
      return res.status(201).json({
        message: RESPONSE_MESSAGES.USER_REGISTERED,
        user: savedUser,
      });
    } else {
      return res
        .status(400)
        .json({ message: RESPONSE_MESSAGES.INTERNAL_ERROR });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: RESPONSE_MESSAGES.INTERNAL_ERROR });
  }
};

export const loginUser = async (req, res) => {
  const { userID, password } = req.body;

  const user = await User.findOne({ userID });

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

export const getAllJAG = async (req, res) => {
  try {
    const { department } = req.body;

    if (!department) {
      return res.status(400).json({
        status: false,
        message: RESPONSE_MESSAGES.REQUIRED_FIELDS,
      });
    }
    // Find all users with role 'JAG' and exclude sensitive fields
    const jagUsers = await User.find({
      role: USER_ROLES.JAG,
      department: department,
    }).select("-password -__v");

    if (!jagUsers || jagUsers.length === 0) {
      return res.status(404).json({
        status: false,
        message: RESPONSE_MESSAGES.JAG_NOT_FOUND,
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: jagUsers.length,
      data: jagUsers,
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
