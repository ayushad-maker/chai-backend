import express from "express"
import { instance } from "../utils/razorpayInstance.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
console.log("Received amount:", req.body.amount);
    console.log("Amount received:", amount); // ✅ check this

    const options = {
      amount: amount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Razorpay Order Creation Error:", error); // ✅ Log full error
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message, // helpful for frontend debugging too
    });
  }
});


export default router