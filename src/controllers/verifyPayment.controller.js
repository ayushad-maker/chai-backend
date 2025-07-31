import crypto from "crypto";
import { Payment } from "../models/payment.model.js";

export const verifyPayment = async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    name,
    email,
    contact,
    amount, 
    cartItems,
    } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return res.status(400).json({ success: false, message: "Invalid Signature!." });
  }
  
  try {
  const payment = await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    contact,
    amount,
    status: "Success",  
    cartItems,
  });

  console.log("✅ Payment saved:", payment);

  return res.status(200).json({
    success: true,
    message: "Payment Verified and Stored.",
    payment, // ✅ return the actual payment object
  });
} catch (error) {
  console.error("Invalid Payment", error);
  return res.status(400).json({
    success: false,
    message: "Failed to Store Payment",
  });
}


}


