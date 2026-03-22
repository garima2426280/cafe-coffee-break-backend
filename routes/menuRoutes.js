const router = require("express").Router();
const MenuItem = require("../models/MenuItem");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all menu items (public)
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    console.error("GET /menu error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST add new item (admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
      return res.status(400).json({ msg: "Image file is required" });
    }

    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const image = req.file.filename;
    const item = new MenuItem({ name, price: Number(price), category, image });
    await item.save();

    res.json({ msg: "Item added", item });
  } catch (err) {
    console.error("POST /menu error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// DELETE item (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: "Item deleted" });
  } catch (err) {
    console.error("DELETE /menu error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;