const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/articles - Semua artikel (PUBLIK)
const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil artikel" });
  }
};

// GET /api/articles/:id - Detail artikel (PUBLIK)
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { comments: true, likes: true },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil detail artikel" });
  }
};

// POST /api/articles - Buat artikel baru (JWT REQUIRED)
const createArticle = async (req, res) => {
  try {
    const { title, body, published } = req.body;
    const userId = req.user.id; // Dari middleware auth

    if (!title || !body) {
      return res.status(400).json({ message: "Title dan body harus diisi" });
    }

    const article = await prisma.article.create({
      data: {
        title,
        body,
        published: published || false,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat artikel" });
  }
};

// PUT /api/articles/:id - Edit artikel (JWT REQUIRED)
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, published } = req.body;
    const userId = req.user.id;

    // Cek apakah artikel ada
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    // Cek kepemilikan
    if (article.authorId !== userId) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk mengedit artikel ini",
      });
    }

    // Update artikel
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title: title || article.title,
        body: body || article.body,
        published: published !== undefined ? published : article.published,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengupdate artikel" });
  }
};

// DELETE /api/articles/:id - Hapus artikel (JWT REQUIRED)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    if (article.authorId !== userId) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk menghapus artikel ini",
      });
    }

    await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Artikel berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus artikel" });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
