import Razorpay from "razorpay";
import dotenv from "dotenv"

dotenv.config({
  path: "./.env", // Correct path to the .env file
});


export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,

})

console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
console.log("KEY SECRET:", process.env.RAZORPAY_KEY_SECRET);
