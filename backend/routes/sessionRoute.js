import express from "express";
import {
  createSession,
  getSessionById,
  getSessionsByUser,
  updateSession,
  deleteSession,
  checkSessionValidity,
  deleteExpiredSessions,
  getAllSessions,
} from "../controllers/sessionController.js";

const router = express.Router();

// Create a new session
router.post("/", createSession);

// Get all sessions
router.get("/", getAllSessions);

// Get session by ID
router.get("/:session_id", getSessionById);

// Get all sessions for a specific user
router.get("/user/:user_id", getSessionsByUser);

// Update session
router.put("/:session_id", updateSession);

// Check session validity
router.get("/:session_id/validity", checkSessionValidity);

// Delete session
router.delete("/:session_id", deleteSession);

// Delete all expired sessions
router.delete("/", deleteExpiredSessions);

export default router;
