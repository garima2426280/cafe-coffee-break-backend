const router = require("express").Router();
const Ad = require("../models/Ad");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find({ active: true });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.json({ success: true, ad });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, ad });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;