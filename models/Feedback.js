const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  orderId: { type: String },
  date: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);