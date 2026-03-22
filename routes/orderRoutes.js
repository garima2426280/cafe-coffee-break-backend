// routes/orderRoutes.js

const router = require("express").Router();
const Order = require("../models/Order");

// SAVE ORDER
router.post("/", async (req,res)=>{
    const order = new Order(req.body);
    await order.save();
    res.json({msg:"Order Saved"});
});

// GET ORDERS
router.get("/", async (req,res)=>{
    const orders = await Order.find();
    res.json(orders);
});

module.exports = router;