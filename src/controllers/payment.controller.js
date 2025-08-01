import { Payment } from "../models/payment.model.js";
import { apiResponse } from "../utils/apiResponse.js";


export const getUserPayment = async (req,res)=>{
 try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const payments = await Payment.find({ email }).sort({ createdAt: -1 });

    // ✅ Correct structure
    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};