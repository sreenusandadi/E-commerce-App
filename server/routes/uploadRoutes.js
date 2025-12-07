const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../controllers/uploadController");

// Single image upload
router.post("/single", upload.single("image"), uploadSingleImage);

// Multiple images upload
router.post("/multiple", upload.array("images", 5), uploadMultipleImages);

module.exports = router;
