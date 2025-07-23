import mongoose, { Schema } from "mongoose";



const subscriptionSchema  = new Schema(
    {
        channel:{
          type:Schema.Types.ObjectId,
          ref:"user"
        },
        subcriber:{
        type:Schema.Types.ObjectId,
        ref:"user"
        }
    },
    {timestamps:true})
 
export const subscription = mongoose.model("subscription",subscriptionSchema)    