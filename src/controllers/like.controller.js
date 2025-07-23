import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
   
    if(!videoId){
        return new ApiError(400,"Video Id for Video Like is not Found.");
    }
    
    const user = req.user?._id;
   
     // check if the user already like the vidoe or not
    const existingLike = await Like.findOne({
        video:videoId,
        likedBy:user
    })

    if(existingLike){
        await Like.deleteOne({_id:existingLike._id})

        return res
        .status(200)
        .json(
            new apiResponse(200,null,"existing like deleted successfully.")
        )
    }
    
    const newLike = await Like.create({
        video: videoId,
        likedBy: user     
    })

    if(!newLike){
        return new ApiError(400,"video is not liked successfully.")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,newLike,"video is liked successfully.")
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    //TODO: toggle like on comment
     
    if(!commentId){
        return new ApiError(400,"comment id is not valid");
    }

    const user = req.user?._id

    const existingCommentLike = await Like.findOne({
        likedBy: user,
        Comment: commentId,
    })        
      if(existingCommentLike){
          await Like.deleteOne({id:existingCommentLike._id}) 

          return res
          .status(200)
          .json(
            new apiResponse(200,null,"existing comment is deleted successfully.")
          )
      }  

    
    const newCommentLike = await Like.create({
         likedBy:user,
         Comment: commentId, 
 })
    
    if(!newCommentLike){
        return new ApiError(400,"new comment is not updated.")
    }
    
    return res
    .status(200)
    .json(
        new apiResponse(200,newCommentLike,"new Comment like successfully.")
    )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!tweetId){
        return new ApiError(400,"Tweet Id for Tweet Like is not Found");
    }
  
    const user = req.user?._id; 

    const existingTweetLike = await Like.findOne({
        tweet:tweetId,
        likedBy:user
    })

    if(existingTweetLike){
        await Like.deleteOne({_id:existingTweetLike._id});

        return res
        .status(200)
        .json(
            new apiResponse(200,null,"existing tweet like is deleted successfully.")
        )
    }

    const newTweetLike = await Like.create({
        tweet:tweetId,
        likedBy:user
    })

    return res
    .status(200)
    .json(
        new apiResponse(200,newTweetLike,"new Tweet Like is Updated successfully.")
    )
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
      
    const userId = req.user?._id;

    if(!userId){
        return new ApiError(400,"user is not valid in getlikedVideos.")
    }
   
    const likedVideos = await Like.find({likedBy:userId,video:{$ne:null}}) //not equals to 
    .populate("video")
    .sort({createdAt:-1})

    if(!likedVideos){
        return new ApiError(400,"No liked Videos find")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,likedVideos,"All liked Videos is Obtained")
    )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}