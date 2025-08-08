import express from "express"
import { Contact } from "../models/contact.models.js";
const router = express.Router();

router.post("/",async (req,res)=>{

   try {
    
    const {name,email,message,Date} = req.body;

    if(!name || !email || !message){
        res.status(500),json({success:false,message:"all of the details are maindatory"})
    }

    const contact = new Contact({name,email,message,Date});
    await contact.save();

    res.status(201).json({success:true,message:"contact is save successfully"})

   } catch (error) {
      res.status(500).json({success:false,message:"contact is not save"})
   }

})

export default router;