const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

// LOGIN OR REGISTER BY PHONE
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
      await user.save();
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// GET USER HISTORY BY PHONE
router.get("/history/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone })
      .sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET ALL USERS (admin)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;