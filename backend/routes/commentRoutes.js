const express = require("express");
const { addComment, toggleLike } = require("../controllers/commentController");
const auth = require("../middleware/auth");
const router = express.Router();

// Protected routes (JWT required)
router.post("/:id/comments", auth, addComment);
router.post("/:id/like", auth, toggleLike);

module.exports = router;
