import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const UserSchema = new Schema(
    { 
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            lowercase:true,
            unique:true,
            required:true,
            trim:true                
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String
        },
        coverImg:{
            type:String
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:[true,"password is required"],
            select:false
        },
        refreshToken:{
            type:String
        }  
    },{timestamps:true}  // created and updated at automatically

)
    //Hooks  
// it is use to check the user document just before save. 

UserSchema.pre("save",async function(next){
    try{ 
        if(this.isModified("password")){
            this.password = await bcrypt.hash(this.password,10);
            return next();
        } 

        if(this.isModified("email")){
            if(!this.isNew){
                const existingUser = await this.constructor.findById(this._id)
                
                if(existingUser && existingUser.email != this.email){
                    return next(new ApiError(400,"previous email is not match with the current one."))
                }
            }
        }
        if(this.isModified("username")){
            if(!this.isNew){
                const existingUserName = await this.constructor.findById(this._id);

                if(existingUserName && existingUserName.username != this.username){
                     return next(new ApiError(400,"username of existing user is not same with th current one."))
                }
            }
        }
                                
        next()

    }catch(error){
        next(error)
    }
})

UserSchema.methods.isPasswordCorrect = async function(password) {
    console.log("Password from req.body:", password);
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this._id,
        username:this.username,
        email:this.username,
        fullname:this.fullname
       },
       process.env.ACCESS_TOKEN_SECRET,
       {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
       }
    )
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
        )
    }


export const User = mongoose.model("User",UserSchema);