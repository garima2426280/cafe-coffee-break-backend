const router = require("express").Router();
const Order = require("../models/Order");

router.get("/daily", async (req, res) => {
  try {
    const orders = await Order.find();
    const daily = {};
    orders.forEach(order => {
      const date = order.date ? order.date.split(",")[0].trim() : "Unknown";
      if (!daily[date]) daily[date] = { date, orders: 0, total: 0 };
      daily[date].orders += 1;
      daily[date].total += order.total;
    });
    res.json(Object.values(daily).sort((a, b) => new Date(a.date) - new Date(b.date)));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/monthly", async (req, res) => {
  try {
    const orders = await Order.find();
    const monthly = {};
    orders.forEach(order => {
      const dateStr = order.date ? order.date.split(",")[0].trim() : "Unknown";
      const parts = dateStr.split("/");
      const monthYear = parts.length >= 2
        ? `${parts[1]}/${parts[2] || new Date().getFullYear()}`
        : "Unknown";
      if (!monthly[monthYear]) monthly[monthYear] = { month: monthYear, orders: 0, total: 0 };
      monthly[monthYear].orders += 1;
      monthly[monthYear].total += order.total;
    });
    res.json(Object.values(monthly));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/customer", async (req, res) => {
  try {
    const orders = await Order.find();
    const customers = {};
    orders.forEach(order => {
      const key = order.phone || "Unknown";
      if (!customers[key]) {
        customers[key] = { phone: order.phone || "Unknown", name: order.name || "Unknown", orders: 0, total: 0 };
      }
      customers[key].orders += 1;
      customers[key].total += order.total;
      customers[key].name = order.name;
    });
    res.json(Object.values(customers).sort((a, b) => b.total - a.total));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/product", async (req, res) => {
  try {
    const orders = await Order.find();
    const products = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name;
        if (!products[key]) products[key] = { name: item.name, qty: 0, total: 0 };
        products[key].qty += item.qty;
        products[key].total += item.price;
      });
    });
    res.json(Object.values(products).sort((a, b) => b.qty - a.qty));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;