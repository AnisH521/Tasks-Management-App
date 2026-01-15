import { User } from "../models/user.model.js";
import { createJWT } from "../util/createJWT.js";
import { RESPONSE_MESSAGES } from "../constant/responseMessage.js";
import { deptPrefixMap, USER_ROLES } from "../constant/userMessage.js";

export const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      department, 
      password, 
      role, 
      isSrScale, 
      isJrScale, 
      isSrDME 
    } = req.body;

    if (!name || !department || !password || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, department, password, and role.' 
      });
    }

    const deptCode = deptPrefixMap[department] || department.substring(0, 4).toUpperCase();

    let idBaseString = '';

    if (role === 'Supervisor') {
      idBaseString = `${deptCode}_SUP`;
    } else if (role === 'Controller') {
      idBaseString = `${deptCode}_CONTROL`; 
    } else if (role === 'Officer') {
      if (isSrDME) idBaseString = `SR_DME_${deptCode}`;
      else if (isSrScale) idBaseString = `${deptCode}_SR_SCALE`;
      else if (isJrScale) idBaseString = `${deptCode}_JR_SCALE`;
      else idBaseString = `${deptCode}_BO`; // Fallback
    } else if (role === 'Admin') {
       idBaseString = `${deptCode}_ADMIN`;
    } else {
       idBaseString = `${deptCode}_USER`;
    }

    // Unique ID (Auto-Increment Logic)
    // search for the latest user with this base string to determine the next number
    // Regex to find IDs starting with base string: ^MECH_SUP_(\d+)$
    const regex = new RegExp(`^${idBaseString}_(\\d+)$`);
    
    // Find the user with the highest number in this category
    const lastUser = await User.findOne({ userID: regex })
      .sort({ createdAt: -1 })
      .select('userID');

    let nextNumber = 1;
    if (lastUser) {
      const match = lastUser.userID.match(regex);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    // Final Auto-Generated ID
    // Example: MECH_SUP_1
    const finalUserId = `${idBaseString}_${nextNumber}`;

    const newUser = new User({
      name,
      department,
      userID: finalUserId,
      password,
      role,
      isSrScale: isSrScale || false,
      isJrScale: isJrScale || false,
      isSrDME: isSrDME || false
    });

    const savedUser = await newUser.save();

    if (savedUser) {
      createJWT(res, savedUser._id);
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
    console.error('Registration Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error during registration' 
    });
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

export const getUserById = async (req, res) => {
  try {
    const { userID } = req.body;

    // Find user by ID and exclude password
    const user = await User.findOne({ userID }).select("-password -__v");

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

export const getAllOfficers = async (req, res) => {
  try {
    const { department, isSrDME, isSrScale, isJrScale } = req.body;

    // Build the Query Object
    // Start by filtering for the correct Role (Branch Officer)
    let query = { 
      role: USER_ROLES.OFFICER // Ensure this matches your enum for 'BO'
    };

    // Filter by Department (Required or Optional depending on your logic)
    if (department) {
      query.department = department;
    }

    // Conditional Filtering for Specific Ranks
    // If any of these flags are true in the request query, add them to the filter.
    
    if (isSrDME === 'true') {
      query.isSrDME = true;
    }
    
    if (isSrScale === 'true') {
      query.isSrScale = true;
    }
    
    if (isJrScale === 'true') {
      query.isJrScale = true;
    }

    // Fetch Users
    const officers = await User.find(query).select("-password -__v");

    // Handle No Results
    if (!officers || officers.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No officers found matching the criteria.",
      });
    }

    // 6. Return Success Response
    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: officers.length,
      data: officers,
    });

  } catch (error) {
    console.error("Error fetching officers:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const getAllSupervisors = async (req, res) => {
  try {
    const { department } = req.body;

    //  SUPERVISOR role
    let query = { 
      role: USER_ROLES.SUPERVISOR // Ensure this matches your enum for Supervisor
    };

    // Department Filter
    if (department) {
      query.department = department;
    }

    // Fetch Data
    const supervisors = await User.find(query).select("-password -__v");

    if (!supervisors || supervisors.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No supervisors found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: supervisors.length,
      data: supervisors,
    });

  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const getAllControlUsers = async (req, res) => {
  try {
    const { department } = req.body;

    //  CONTROLLER role
    let query = { 
      role: USER_ROLES.CONTROLLER
    };

    // Department Filter
    if (department) {
      query.department = department;
    }

    // 3. Fetch Data
    const controllers = await User.find(query).select("-password -__v");

    if (!controllers || controllers.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No control users found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: RESPONSE_MESSAGES.SUCCESS,
      count: controllers.length,
      data: controllers,
    });

  } catch (error) {
    console.error("Error fetching control users:", error);
    return res.status(500).json({
      status: false,
      message: RESPONSE_MESSAGES.INTERNAL_ERROR,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userID } = req.body;

    // Find and delete the user by ID
    const deletedUser = await User.findOneAndDelete({ userID });

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
