const router = require("express").Router();
const Table = require("../models/Table");
const auth = require("../middleware/auth");

// Initialize tables 1-20 if not exist
const initTables = async () => {
  for (let i = 1; i <= 20; i++) {
    await Table.findOneAndUpdate(
      { tableNumber: i },
      { $setOnInsert: { tableNumber: i, isBooked: false } },
      { upsert: true, new: true }
    );
  }
};
initTables();

// Auto-release expired bookings
const releaseExpiredTables = async () => {
  const now = new Date();
  await Table.updateMany(
    { isBooked: true, releasesAt: { $lte: now } },
    { isBooked: false, bookedBy: null, bookedByName: null, bookedAt: null, releasesAt: null }
  );
};

// GET all tables with live status
router.get("/", async (req, res) => {
  try {
    await releaseExpiredTables();
    const tables = await Table.find().sort({ tableNumber: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// CHECK single table availability
router.get("/check/:number", async (req, res) => {
  try {
    await releaseExpiredTables();
    const table = await Table.findOne({ tableNumber: Number(req.params.number) });
    if (!table) return res.status(404).json({ msg: "Table not found" });
    if (table.isBooked) {
      const remaining = Math.ceil((new Date(table.releasesAt) - new Date()) / 60000);
      return res.json({
        available: false,
        bookedBy: table.bookedByName,
        minutesLeft: remaining > 0 ? remaining : 0,
      });
    }
    res.json({ available: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// BOOK a table
router.post("/book", async (req, res) => {
  try {
    await releaseExpiredTables();
    const { tableNumber, phone, name } = req.body;
    const table = await Table.findOne({ tableNumber: Number(tableNumber) });
    if (!table) return res.status(404).json({ msg: "Table not found" });
    if (table.isBooked) {
      const remaining = Math.ceil((new Date(table.releasesAt) - new Date()) / 60000);
      return res.status(400).json({
        msg: `Table ${tableNumber} is already booked. Please select another table or wait ${remaining} min.`,
        available: false,
        minutesLeft: remaining,
      });
    }
    const now = new Date();
    const releasesAt = new Date(now.getTime() + 15 * 60 * 1000);
    await Table.findOneAndUpdate(
      { tableNumber: Number(tableNumber) },
      { isBooked: true, bookedBy: phone, bookedByName: name, bookedAt: now, releasesAt }
    );
    res.json({ success: true, msg: "Table booked successfully", releasesAt });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// RELEASE a table (after order done)
router.post("/release", auth, async (req, res) => {
  try {
    const { tableNumber } = req.body;
    await Table.findOneAndUpdate(
      { tableNumber: Number(tableNumber) },
      { isBooked: false, bookedBy: null, bookedByName: null, bookedAt: null, releasesAt: null }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;