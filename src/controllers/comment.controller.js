import { Comment } from "../models/comment.models.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideosComments = asyncHandler(async(req,res)=>{
        
        const{videoId} = req.params;

        if(!videoId){
          return new ApiError(400,"video Id for get Comments is not found successfully.");
        }

        const getComments = await Comment.find({video:videoId})
        .populate("owner, username, Avatar")
        .sort({createdAt:-1})

        if(!getComments){
          return new ApiError(400,"comments is not Fetched Successfully.")
        }

        return res
        .status(200)
        .json(
          new apiResponse(200,getComments,"All comments Fetched Successfully.")
        )
})

const addComments = asyncHandler(async(req,res)=>{
   
       const {content,videoId} = req.body;

       if(!content || !videoId){
        return new ApiError(400,"Both of This field Are Required.")
       }

       const addComment = await Comment.create({
           content,
           video : videoId,
           owner : req.user?._id,
       })
       
       
       if(!addComment){
        return new ApiError(400,"Comment is not added Successfully");
       }

       return res
       .status(200)
       .json(
        new apiResponse(200,addComment,"comment is added successfully.")
       )
})

const updateComments = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (!content?.trim()) {
    throw new ApiError(400, "Comment content is required");
  }

  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user?._id }, // secure: only comment owner can update
    { content },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new apiResponse(200, updatedComment, "Comment updated successfully"));
})

const deleteComments = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    owner: req.user?._id, // ensure only the owner can delete
  });

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found or unauthorized");
  }

  return res
    .status(200)
    .json(new apiResponse(200, deletedComment, "Comment deleted successfully"));
});


export{
    getVideosComments,
    addComments,
    updateComments,
    deleteComments
}