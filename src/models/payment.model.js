import mongoose from "mongoose";

const paymentSchmea = new mongoose.Schema({
     razorpay_order_id:{
        type:String,
     },
     razorpay_payment_id:{
        type:String,
     },
     razorpay_signature:{
        type:String,
     },
     name:{
        type:String,
     },
     email:{
        type:String, 
     },
     contact:{
        type:String,
     },
     cartItems:[
      {
         ProductId:String,
         name:String,
         price:String,
         quantity:Number,
         image:String
      }
     ],
     amount:{
        type:Number
     },
     status:{
        type:String,
        default:"Success",
     },
     createdAt:{
        type:Date,
        default:Date.now,
     },


  
},{timestamps:true});


export const Payment = mongoose.model("Payment",paymentSchmea)