const router = require("express").Router();
const Offer = require("../models/Offer");
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const offers = await Offer.find({ active: true });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, offer });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;