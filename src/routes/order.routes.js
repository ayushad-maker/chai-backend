
import { Router } from "express";
import { Payment } from "../models/payment.model.js";
import { apiResponse } from "../utils/apiResponse.js";


const router = Router();

router.get("/all",async (req,res)=>{
        try {
            const payment = await Payment.find().sort({createdAt:-1});
            
            return res
            .status(200)
            .json(
             new apiResponse(200,payment,"All Payment Fetch successfully.")
            )
        } catch (error) {
            console.log(error)
            return res.status(400).json({success:false,message:"failed to fetch payments.!"})
        }
})

export default router;