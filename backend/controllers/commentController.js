const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /api/articles/:id/comments - Tambah komentar (JWT REQUIRED)
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: "Komentar tidak boleh kosong" });
    }

    // Cek apakah artikel ada
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        articleId: parseInt(id),
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan komentar" });
  }
};

// POST /api/articles/:id/like - Toggle like/unlike (JWT REQUIRED)
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Cek apakah artikel ada
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    // Cek apakah user sudah like
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: parseInt(id),
        },
      },
    });

    if (existingLike) {
      // Unlike: hapus like
      await prisma.articleLike.delete({
        where: {
          userId_articleId: {
            userId,
            articleId: parseInt(id),
          },
        },
      });
      return res.status(200).json({ liked: false, message: "Like dibatalkan" });
    } else {
      // Like: tambah like
      await prisma.articleLike.create({
        data: {
          userId,
          articleId: parseInt(id),
        },
      });
      return res.status(200).json({ liked: true, message: "Berhasil like" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memproses like" });
  }
};

module.exports = {
  addComment,
  toggleLike,
};
