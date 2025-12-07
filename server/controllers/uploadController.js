exports.uploadSingleImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const fullUrl = req.protocol + "://" + req.get("host");
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `${fullUrl}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadMultipleImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const images = req.files.map((file) => `/uploads/${file.filename}`);

    res.status(200).json({
      message: "Images uploaded successfully",
      images,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
