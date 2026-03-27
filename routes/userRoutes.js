const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;
    let user = await User.findOne({ phone: phone.toString().trim() });
    if (!user) {
      user = new User({ phone: phone.toString().trim() });
      await user.save();
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

router.get("/history/:phone", async (req, res) => {
  try {
    const phone = req.params.phone.toString().trim();
    const orders = await Order.find({ phone: phone }).sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;