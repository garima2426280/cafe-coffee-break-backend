const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true },
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: String, default: null },
  bookedByName: { type: String, default: null },
  bookedAt: { type: Date, default: null },
  releasesAt: { type: Date, default: null },
});

module.exports = mongoose.model("Table", tableSchema);