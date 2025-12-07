require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const productRoutes = require("./routes/productRoutes.js");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerce-app-qdz6.onrender.com",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Make uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  // MongoDB Connection
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));
});
