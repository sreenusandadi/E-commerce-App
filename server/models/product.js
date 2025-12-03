const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    tags: [{ type: String, required: true }],
    price: { type: Number, required: true },
    salePrice: { type: Number },
    bestSeller: { type: Boolean, default: false },
    category: { type: String, required: true, trim: true },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
