const express = require("express");
const cors = require("cors");
require("dotenv").config();

// IMPORT SEMUA ROUTES
const authRoutes = require("./routes/authRoutes"); // ← TAMBAHKAN INI
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes); // ← TAMBAHKAN INI
app.use("/api/articles", articleRoutes);
app.use("/api/articles", commentRoutes);

app.get("/", (req, res) => {
  res.send("Mini Blog API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // ← Perbaiki: pakai backtick (`) bukan kutip biasa (')
});
