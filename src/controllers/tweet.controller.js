import {Tweet} from "../models/tweet.model.js"
import {ApiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
     const {content} = req.body;

     if(!content || !content.trim()){
        return new ApiError(400,"This content Field is required.")
     }

     const userId = req.user?._id;

     const newTweet = await Tweet.create({
        content,
        owner: userId
})

     return res
     .status(200)
     .json(
        new apiResponse(200,newTweet,"new Tweet is created successfully.")
     )

       
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets 
    
    const {userId} = req.params;

    if(!userId){
        return new ApiError(400,"Video id Is not found successfully.")
    }

    const getUserTweet = await Tweet.find({id:userId})
    .sort({createdAt:-1})
    
    if(!getUserTweet){
        return new ApiError(400,"User tweet is fetched successfully.")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,getUserTweet,"We have successfully fetched all tweets successfully.")
    )


    
})

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  if (!content || !content.trim()) {
    throw new ApiError(400, "Content is required to update the tweet.");
  }

  const userId = req.user?._id;

  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, owner: userId },
    { content },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(400, "Tweet was not updated successfully.");
  }

  return res.status(200).json(
    new apiResponse(200, updatedTweet, "Tweet updated successfully.")
  );
})

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required to delete.");
  }

  const deletedTweet = await Tweet.findOneAndDelete({
    _id: tweetId,
    owner: userId,
  });

  if (!deletedTweet) {
    throw new ApiError(400, "Tweet was not deleted successfully.");
  }

  return res.status(200).json(
    new apiResponse(200, deletedTweet, "Tweet deleted successfully.")
  );
});


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}