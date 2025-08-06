import { Product } from "../models/product.model.js"


export const getAllProducts = async(req,res)=>{
     
    try{
    const product = await Product.find();
    res.status(200).json({success:true,product}) 
    }catch{
      res.status(500).json({success:false,messsage:"Failed to fetch all data."})
    }
}

