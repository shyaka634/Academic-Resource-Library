import sessions from "../models/sessionModel.js";
import User from "../models/userModel.js";
import { Op } from "sequelize";

// Create a new session
export const createSession = async (req, res) => {
  try {
    const { user_id, expires_at } = req.body;

    // Validate input
    if (!user_id || !expires_at) {
      return res.status(400).json({
        success: false,
        message: "user_id and expires_at are required",
      });
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create session
    const newSession = await sessions.create({
      user_id,
      expires_at,
      created_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: newSession,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({
      success: false,
      message: "Error creating session",
      error: error.message,
    });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await sessions.findByPk(session_id, {
      include: [{ model: User, attributes: ["user_id", "username"] }],
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching session",
      error: error.message,
    });
  }
};

// Get all sessions for a user
export const getSessionsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userSessions = await sessions.findAll({
      where: { user_id },
      include: [{ model: User, attributes: ["user_id", "username"] }],
    });

    res.status(200).json({
      success: true,
      count: userSessions.length,
      data: userSessions,
    });
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user sessions",
      error: error.message,
    });
  }
};

// Update session
export const updateSession = async (req, res) => {
  try {
    const { session_id } = req.params;
    const { expires_at } = req.body;

    const session = await sessions.findByPk(session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await session.update({ expires_at });

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({
      success: false,
      message: "Error updating session",
      error: error.message,
    });
  }
};

// Delete session
export const deleteSession = async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await sessions.findByPk(session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await session.destroy();

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting session",
      error: error.message,
    });
  }
};

// Check if session is valid (not expired)
export const checkSessionValidity = async (req, res) => {
  try {
    const { session_id } = req.params;

    const session = await sessions.findByPk(session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
        isValid: false,
      });
    }

    const now = new Date();
    const isValid = new Date(session.expires_at) > now;

    res.status(200).json({
      success: true,
      isValid,
      message: isValid ? "Session is valid" : "Session has expired",
      session: isValid ? session : null,
    });
  } catch (error) {
    console.error("Error checking session validity:", error);
    res.status(500).json({
      success: false,
      message: "Error checking session validity",
      error: error.message,
    });
  }
};

// Delete expired sessions
export const deleteExpiredSessions = async (req, res) => {
  try {
    const now = new Date();

    const result = await sessions.destroy({
      where: {
        expires_at: { [Op.lte]: now },
      },
    });

    res.status(200).json({
      success: true,
      message: "Expired sessions deleted",
      deletedCount: result,
    });
  } catch (error) {
    console.error("Error deleting expired sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting expired sessions",
      error: error.message,
    });
  }
};

// Get all sessions
export const getAllSessions = async (req, res) => {
  try {
    const allSessions = await sessions.findAll({
      include: [{ model: User, attributes: ["user_id", "username"] }],
    });

    res.status(200).json({
      success: true,
      count: allSessions.length,
      data: allSessions,
    });
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching all sessions",
      error: error.message,
    });
  }
};
