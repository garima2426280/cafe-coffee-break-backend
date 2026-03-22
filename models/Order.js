const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: String,
  table: Number,
  payment: String,
  items: Array,
  total: Number,
  date: String
});

module.exports = mongoose.model("Order", orderSchema);