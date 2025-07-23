import mongoose from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import { subscription } from "../models/subscription.models.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
     const {channelId} = req.params;
      
     if(!channelId || !mongoose.Types.ObjectId.isValid(channelId)){
        return new ApiError(400,"Channel Id is not Valid!.")
     }
   // get channel total videos and total views.

     const videos = await Video.find({owner:channelId}).select("views");

     const totalVideos = videos.length;

     const totalViews =  videos.reduce((acc,video) => acc + (video.views || 0),0)
      //total subscriber
     const totalSubscriber  = await subscription.countDocuments({channel:channelId});

     //get total likes on this channel's videos

      const videoIds =  videos.map(video=>video._id);
      const totalLikes = await Like.countDocuments({video:{$in:videoIds}})
    
     const stats ={
        totalVideos,
        totalViews,
        totalSubscriber,
        totalLikes
     }

     return res
     .status(200)
     .json(
        new apiResponse(200,stats,"Get Channel Stats successfully.")
     )
    

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
   
    const {channelId} = req.params;

    if(!channelId || !mongoose.Types.ObjectId.isValid(channelId)){
        return new ApiError(400,"channel id is not valid.")
    }

   const channel = await Video.find({owner:channelId})
   .sort({createdAt:-1})

   return res
   .status(200)
   .json(
    new apiResponse(200,channel,"Get all Channel Videos Successfully.")
   )

})

export {
    getChannelStats, 
    getChannelVideos
    }