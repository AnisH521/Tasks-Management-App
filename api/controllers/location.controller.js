import mongoose from "mongoose";
import { Location } from "../models/location.model.js";

export const registerStation = async (req, res) => {
  try {
    const { stations } = req.body;

    // Validate required fields
    if (!stations || !Array.isArray(stations) || stations.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one section name is required",
      });
    }

    // remove out empty names
    const validstations = stations
      .map((station) => station.trim())
      .filter((station) => station.length > 0);

    if (validstations.length === 0) {
      return res.status(400).json({
        status: false,
        message: "All station names are empty or invalid",
      });
    }

    // Create multiple locations
    const newLocations = await Location.insertMany(
      validstations.map((station) => ({ station }))
    );

    if (newLocations && newLocations.length > 0) {
      return res.status(201).json({
        status: true,
        message: "stations registered successfully",
        data: newLocations.map((location) => ({
          sectionId: location._id,
          section: location.section,
          createdAt: location.createdAt,
        })),
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Failed to register stations",
      });
    }
  } catch (error) {
    console.error("Error registering stations:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Controller to get all stations
export const getAllstations = async (req, res) => {
  try {
    const stations = await Location.find().sort({ createdAt: -1 });

    if (!stations || stations.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No stations found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "stations retrieved successfully",
      data: stations.map((section) => ({
        sectionId: section._id,
        section: section.section,
        createdAt: section.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching stations:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

// Controller to delete one or multiple stations
export const deletestations = async (req, res) => {
  try {
    const { sectionIds } = req.body;

    if (!sectionIds || !Array.isArray(sectionIds) || sectionIds.length === 0) {
      return res.status(400).json({
        status: false,
        message: "At least one section ID is required",
      });
    }

    const deleteResult = await Location.deleteMany({
      _id: { $in: sectionIds },
    });

    if (deleteResult.deletedCount > 0) {
      return res.status(200).json({
        status: true,
        message: `${deleteResult.deletedCount} section(s) deleted successfully`,
      });
    } else {
      return res.status(404).json({
        status: false,
        message: "No matching stations found to delete",
      });
    }
  } catch (error) {
    console.error("Error deleting stations:", error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
