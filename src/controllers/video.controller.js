import {Video} from "../models/video.models.js"
import {ApiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10,sortBy="createdAt", sortType="desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    const matchStage = {isPublished:true}

    if(userId){
        matchStage.onwer = userId
    }

    const aggregateQuery = Video.aggregate([
        {$match:matchStage},

        {
            $lookup:{
                from:"User",
                localField:"owner",
                foreignField:"_id",
                as:"owner"
            }
        },
        {$unwind:$owner},
        {
            $project:{
                 title: 1,
                 description: 1,
                 thumbnail: 1,
                 views: 1,
                 createdAt: 1,
                 owner:{
                    _id:1,
                    username:1,
                    email:1
                 }
            }
        }
    ]);

    const options = {
        page:parseInt(page),
        limit:parseInt(limit),
        sort:{[sortBy]:sortBy==="asc"? 1: -1},
        sort:{[sortType]:sortType==="desc"? 1 : -1}
    }

    const videos =  await Video.aggregatePaginate(aggregateQuery,options);

    return res
    .status(200)
    .json(
        new apiResponse(200,videos,"Videos Fetched Successfully.")
    )
    

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description,duration} = req.body
    // TODO: get video, upload to cloudinary, create video
    const VideoFile = req.files?.VideoFile?.[0]
    const thumbnail = req.files?.thumbnail?.[0]
    
    if(!title || !description || !duration || !VideoFile || !thumbnail){
        return new ApiError(400,"All fields are required.")
    }
     
    const videoUpload = await uploadOnCloudinary(VideoFile.path);
    const thumbnailupload = await uploadOnCloudinary(thumbnail.path);

    if(!videoUpload || !thumbnailupload){
        return new ApiError(400,"upload to cloudinary is failed.")
    }

    const newVideo = await Video.create({
        description,
        duration,
        title,
        VideoFile:videoUpload.secure_url,
        thumbnail:thumbnailupload.secure_url,
        owner:req.user?._id
    })

    return res
    .status(200)
    .json(
        new apiResponse(200,newVideo,"Video Published Successfully.")
    )


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id


    if(!videoId){
        return new ApiError(400,"Video id is not Valid to Get Video by Id.")
    }

    const getVideoById = await Video.findById(videoId)

    if(!getVideoById){
        return new ApiError(400,"Video is not get by id.")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,getVideoById,"get all video from Id.")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!videoId) {
        throw new ApiError(400, "Video Id to update is not valid.");
    }

    const userId = req.user?._id;

    const video = await Video.findOne({ _id: videoId, owner: userId });

    if (!video) {
        throw new ApiError(404, "Video not found or you're not authorized.");
    }

    if (title) video.title = title;
    if (description) video.description = description;

    // thumbnail file
    if (req.file) {
        video.thumbnail = req.file.path; // or req.file.filename depending on how you store it
    }

    await video.save();

    return res.status(200).json(
        new apiResponse(200, video, "Video updated successfully.")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!videoId){
        return new ApiError(400,"video id is not find to delete video.")
    }

    const user = req.user?._id;

    const videoDelete = await Video.findByIdAndDelete(
        {id:videoId},
        {owner:user}
    )

    if(!videoDelete){
        return new ApiError(400,"Video is not deleted")
    }

    return res
    .status(200)
    .json(
        new apiResponse(200,null,"Video is deleted Successfully.")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400,"Video id is not found.")
    }

    const userId =  req.user?._id;

    const video = await Video.findOne({_id:videoId,owner:userId})

    if(!video){
        throw new ApiError(400,"Video not found or you're not authorized to update it");
    }

    video.isPublished = !video.isPublished;

    await video.save();

    return res
    .status(200)
    .json(
        new apiResponse(200,video,`video is now ${video.isPublished ? "published": "unpublished"}`)
    )

    


})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}