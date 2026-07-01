const express = require("express");
const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../controllers/articleController");
const auth = require("../middleware/auth");
const router = express.Router();

// Public routes
router.get("/", getAllArticles);
router.get("/:id", getArticleById);

// Protected routes (JWT required)
router.post("/", auth, createArticle);
router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

module.exports = router;
