import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



const genrateAccessandRefreshTokens = async (userId) => {
    try {
        console.log("🔑 Step 1: Fetching user by ID:", userId);
        const user = await User.findById(userId);

        if (!user) {
            console.log("❌ User not found");
            throw new ApiError(404, "User not found during token generation");
        }

        console.log("🔑 Step 2: Generating tokens");
        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        console.log("📝 Step 3: Saving refresh token to DB");
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log("✅ Tokens generated successfully");

        return { refreshToken, accessToken };
    } catch (error) {
        console.error("🚨 Error inside token generator:", error);
        throw new ApiError(400, "Something went wrong while generating access and refresh token.");
    }
};
     

    
const registerUser = asyncHandler(async (req,res)=>{
        // get user detail from the frontend -
        // validation-not empty -
        // check if user is already existed or not -
        // check for images or avatar -
        // upload them on cloudinary, avatar -
        // create user object - create entry in db -
        // remove password and refresh token field from response -
        // check for user creation - 
        // return response 


        // get user detail
        const {fullname,email,username,password} = req.body
       
       //validation  
        if(
            [fullname,email,username,password].some((field)=>
            field?.trim()==="")
        ){
           throw new ApiError(400,"all fields are required.")
        }
        if(!email.includes("@")){
           throw new ApiError(400,"email should contain @ symbol");
        }

        // check if user existed or not
    
        const cleanedUsername = username?.trim().toLowerCase();
        const cleanedEmail = email?.trim().toLowerCase();


        const existedUser = await User.findOne({
            $or:[{ username :cleanedUsername },{ email : cleanedEmail }]
        })
        if(existedUser){
            throw new ApiError(409,"user is already existed");
        }

        // check for images and avatar
        const avatarLocalPath =  req.files?.avatar?.[0]?.path;
        console.log("avatar localFilePath",avatarLocalPath);
       // const coverImgLocalPath =  req.files?.coverImg[0]?.path;

        let coverImgLocalPath;
        if(req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0){
            coverImgLocalPath = req.file?.coverImg?.[0]?.path
        }
        
        console.log(req.files);
        if(!avatarLocalPath){
            throw new ApiError(400,"avatar image not found");
        } 
          
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("avatar file",avatar);
        const coverImg = coverImgLocalPath? await uploadOnCloudinary(coverImgLocalPath) : null;

    

        if(!avatar){
            throw new ApiError(400,"avatar file is required");
        }

       const user = await User.create({
       fullname,
       email,
       password,
       username: username.toLowerCase(),
       avatar: avatar.url,
       coverImg: coverImg?.url || ""
       });

       const createdUser = await User.findById(user._id)
       .select("-password -refreshToken -createdAt -updatedAt")
       .lean();
       
       if(!createdUser){
        throw new ApiError(500,"something went wrong while regestring the user");
       } 
    
       return res.status(201).json(
        new apiResponse(200,createdUser,"user is created succesfully.")
       )
    })
//done
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Login inputs:", { email, password });

  // Validate inputs
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  // Find user (include password explicitly if schema hides it by default)
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found with this email.");
  }

  // Check if user has a password
  if (!user.password) {
    throw new ApiError(500, "Password not stored for this user.");
  }

  // Compare password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password.");
  }

  // Generate new tokens
  const { accessToken, refreshToken } = await genrateAccessandRefreshTokens(user._id);

  // Get user details without sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -createdAt -updatedAt"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // Send response with cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    });
});


const logOutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized: User not authenticated");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: 1 } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User is logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(400, "Unauthorized request");
    }

    try {
        const decodeToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodeToken?._id);

        if (!user || !user.refreshToken) {
            throw new ApiError(400, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or has been reused");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, refreshToken: newRefreshToken } =
            await genrateAccessandRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

const changeCurrentUserPassword = asyncHandler(async(req,res)=>{
      const {oldpassword,newpassword} = req.body

      const user =  await User.findById(req.user?._id)
      const isPasswordCorrect =  await user.isPasswordCorrect(oldpassword)

      if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
      }

      user.password = newpassword
      await user.save({validateBeforeSave:false})
      

      return res
      .status(200)
      .json(
        new apiResponse(200,{},"password changed successfully")
      )
})// done 

const getcurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(
        new apiResponse(200,req.user,"user get fetched successfully.")
    )
}) // done

const updateAccountDetails = asyncHandler(async(req,res)=>{
        
      const {email,fullname} = req.body
      
      if(!email || !fullname){
        throw new ApiError(400,"All fields are required")
      }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,    // with the help of set function we can change the variables.
                email
            }
        },
        {new:true}     //🔄 This tells Mongoose to return the updated document, not the old one.

                        // Without this, you'd get the document before the update.
    ).select(" -password ")

    return res
    .status(400)
    .json(
        new apiResponse(200,user,"Account details updated successfully.")
    )
       
}) //done

const updateUserAvatar = asyncHandler(async(req,res)=>{
        const avatarLocalPath = req.files?.path

        if(!avatarLocalPath){
            throw new ApiError(400,"avatar files is not uploded successfully");
        }

        const avatar = await uploadOnCloudinary(uploadAvatar);

        if(!avatar.url){
            throw new ApiError(400,"avatar url is not uploaded successfully");  
        }

       const user =  await User.findByIdAndUpdate(
            req.user?._id,
           {
            $set:{
                avatar:avatar.url
            }
           },
           {new:true}
        ).select("-password")

        return res
        .status(200)
        .json(
            new apiResponse(200,"avatar file is uploded successfully")
        )
})  //done 

const updateCoverImg = asyncHandler(async(req,res)=>{
        const coverImgLocalPath = req.files?.path

        if(!coverImgLocalPath){
            throw new ApiError(400,"cover Img files is not uploded successfully");
        }

        const coverImg = await uploadOnCloudinary(coverImgLocalPath)

        if(!coverImg.url){
            throw new ApiError(400,"avatar url is not uploaded successfully");  
        }

       const user =  await User.findByIdAndUpdate(
            req.user?._id,
           {
            $set:{
                coverImg:coverImg.url
            }
           },
           {new:true}
        ).select("-password")

        return res
        .status(200)
        .json(
            new apiResponse(200,"coverImg file is uploded successfully")
        )
}) //done

const getUserProfile = asyncHandler(async(req,res)=>{
      const {username} = req.params

      if(!username?.trim()){
        throw new ApiError(400,"username is not existed")
      }

      const channel =  await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from: "subscriptions",
                localField:"_id",
                foreignfield:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"subscribers",
                },
                channelsSubscribedToCount:{
                    $size:"subscribedTo" 
                },
                isSubscribed:{
                    $cond:{    //this value      //is present in this or not 
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullname:1,
                email:1,
                username:1,
                subscriberCount:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImg:1
            }
        }    
      ])
    
      if(!channel.length){
        throw new ApiError(400,"channel does not exist")
      }

      return res
      .status(200)
      .json(
        new apiResponse(200,channel[0]," user channel fetched successfully")
      )
}) //done 
 
const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        avatar: 1,
                                        username: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$owner" }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json(
        new apiResponse(
            200,
            user[0]?.watchHistory || [],
            "Watch history fetched successfully"
        )
    );
});

const getLikeButton = asyncHandler(async(req,res)=>{
       
       
})

export {registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getcurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateCoverImg,
    getUserProfile,
    getWatchHistory,
    getLikeButton
}

