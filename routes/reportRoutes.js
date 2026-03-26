const router = require("express").Router();
const Order = require("../models/Order");

// DATE WISE SALES
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

// WEEKLY SALES
router.get("/weekly", async (req, res) => {
  try {
    const orders = await Order.find();
    const weekly = {};

    orders.forEach(order => {
      const dateStr = order.date ? order.date.split(",")[0].trim() : null;
      if (!dateStr) return;

      const parts = dateStr.split("/");
      if (parts.length < 3) return;

      const d = new Date(`${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`);
      if (isNaN(d.getTime())) return;

      const startOfYear = new Date(d.getFullYear(), 0, 1);
      const weekNum = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
      const key = `Week ${weekNum}, ${d.getFullYear()}`;

      if (!weekly[key]) weekly[key] = { week: key, orders: 0, total: 0, weekNum };
      weekly[key].orders += 1;
      weekly[key].total += order.total;
    });

    const result = Object.values(weekly).sort((a, b) => a.weekNum - b.weekNum);
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// MONTHLY SALES
router.get("/monthly", async (req, res) => {
  try {
    const orders = await Order.find();
    const monthly = {};
    orders.forEach(order => {
      const dateStr = order.date ? order.date.split(",")[0].trim() : "Unknown";
      const parts = dateStr.split("/");
      const monthYear = parts.length >= 2
        ? `${parts[0]}/${parts[2] || new Date().getFullYear()}`
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

// CUSTOMER WISE SALES
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

// PRODUCT WISE SALES — fixed orders count
router.get("/product", async (req, res) => {
  try {
    const orders = await Order.find();
    const products = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.name;
        if (!products[key]) products[key] = { name: item.name, qty: 0, total: 0, orders: 0 };
        products[key].qty += item.qty;
        products[key].total += item.price;
        products[key].orders += 1;
      });
    });
    res.json(Object.values(products).sort((a, b) => b.qty - a.qty));
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;