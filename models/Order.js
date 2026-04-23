const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String, required: true },
  table: { type: String, required: true },
  payment: { type: String, required: true },
  items: [
    {
      name: String,
      qty: Number,
      price: Number,
      originalPrice: Number,
      discount: { type: Number, default: 0 },
    }
  ],
  subtotal: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  originalTotal: { type: Number, default: 0 },
  savedAmount: { type: Number, default: 0 },
  happyHour: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'ready'], default: 'pending' },
  date: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);