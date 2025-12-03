const express = require("express");

const {
  addProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController.js");

const router = express.Router();

// Create Product
router.post("/", addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);
router.put("/:id", updateProduct);

module.exports = router;
