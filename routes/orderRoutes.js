const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// Save new order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get pending orders (queue)
router.get("/queue", async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" }).sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get order status by phone (latest)
router.get("/status/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update order status to ready (admin)
router.put("/status/:id", auth, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;