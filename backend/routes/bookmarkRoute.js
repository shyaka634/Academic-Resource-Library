import express from 'express';
import { createBookmark, getBookmarksByUser, deleteBookmark } from '../controllers/bookmarkController.js';

const router = express.Router();

// Create a new bookmark
router.post('/', createBookmark);

// Get all bookmarks for a user
router.get('/:user_id', getBookmarksByUser);

// Delete a bookmark
router.delete('/:bookmark_id', deleteBookmark);

export default router;
