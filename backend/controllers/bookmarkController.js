import Bookmark from "../models/bookmarkModel.js";
import User from "../models/userModel.js";
import Resource from "../models/resoucesModel.js";

// Create a new bookmark
export const createBookmark = async (req, res) => {
    try {
        const { user_id, resource_id } = req.body;

        if (!user_id || !resource_id) {
            return res.status(400).json({ message: "User ID and Resource ID are required" });
        }

        const newBookmark = await Bookmark.create({
            user_id,
            resource_id,
            created_at: new Date()
        });

        res.status(201).json({ message: "Bookmark created successfully", bookmark: newBookmark });
    } catch (error) {
        console.error("Error creating bookmark:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all bookmarks for a user
export const getBookmarksByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const bookmarks = await Bookmark.findAll({
            where: { user_id },
            include: [
                { model: User, attributes: ["user_id", "username"] },
                { model: Resource, attributes: ["resource_id", "title", "file_url"] }
            ]
        });

        res.status(200).json({ bookmarks });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a bookmark
export const deleteBookmark = async (req, res) => {
    try {
        const { bookmark_id } = req.params;

        if (!bookmark_id) {
            return res.status(400).json({ message: "Bookmark ID is required" });
        }

        const deletedRows = await Bookmark.destroy({
            where: { bookmark_id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Bookmark not found" });
        }

        res.status(200).json({ message: "Bookmark deleted successfully" });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};