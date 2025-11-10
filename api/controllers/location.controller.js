import mongoose from "mongoose";
import { Location } from "../models/location.model.js";

export const registerSection = async (req, res) => {
  try {
    const { sections } = req.body;

    // Validate required fields
    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one section name is required",
      });
    }

    // Trim and filter out empty names
    const validSections = sections
      .map(section => section.trim())
      .filter(section => section.length > 0);

    if (validSections.length === 0) {
      return res.status(400).json({
        status: false,
        message: "All section names are empty or invalid",
      });
    }

    // Create multiple locations
    const newLocations = await Location.insertMany(
      validSections.map(section => ({ section }))
    );

    if (newLocations && newLocations.length > 0) {
      return res.status(201).json({
        status: true,
        message: "Sections registered successfully",
        data: newLocations.map(location => ({
          sectionId: location._id,
          section: location.section,
          createdAt: location.createdAt,
        })),
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Failed to register sections",
      });
    }
  } catch (error) {
    console.error("Error registering sections:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


// Controller to get all sections
export const getAllSections = async (req, res) => {
  try {
    const sections = await Location.find().sort({ createdAt: -1 });

    if (!sections || sections.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No sections found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Sections retrieved successfully",
      data: sections.map(section => ({
        sectionId: section._id,
        section: section.section,
        createdAt: section.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching sections:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Controller to delete one or multiple sections
export const deleteSections = async (req, res) => {
  try {
    const { sectionIds } = req.body;

    if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one section ID is required",
      });
    }

    const deleteResult = await Location.deleteMany({ _id: { $in: sectionIds } });

    if (deleteResult.deletedCount > 0) {
      return res.status(200).json({
        status: true,
        message: `${deleteResult.deletedCount} section(s) deleted successfully`,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No matching sections found to delete",
      });
    }
  } catch (error) {
    console.error("Error deleting sections:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
