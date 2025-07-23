import mongoose from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, Videos = [] } = req.body
    const userId = req.user._id

    if (!name || !description) {
        throw new ApiError(400, "Both name and description fields are required.")
    }

    const existing = await Playlist.findOne({ name, owner: userId })

    if (existing) {
        throw new ApiError(400, "Playlist already exists with the same name.")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: Videos, // NOTE: field should be lowercase `videos`
        owner: userId
    })

    return res.status(200).json(
        new apiResponse(200, playlist, "New Playlist created.")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "User ID is not valid.")
    }

    const userPlaylists = await Playlist.find({ owner: userId })
        .populate("videos", "title description")
        .sort({ createdAt: -1 })

    return res.status(200).json(
        new apiResponse(200, userPlaylists, "Successfully fetched user playlists.")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.")
    }

    const playlist = await Playlist.findById(playlistId)
        .populate("owner", "name email avatarImg")
        .populate("videos", "title description duration thumbnailUrl")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found.")
    }

    return res.status(200).json(
        new apiResponse(200, playlist, "Playlist fetched successfully.")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (
        !playlistId || !mongoose.Types.ObjectId.isValid(playlistId) ||
        !videoId || !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid playlist ID or video ID")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } }, // Prevent duplicate videos
        { new: true }
    ).populate("videos", "title description")

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Video added to playlist successfully.")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (
        !playlistId || !mongoose.Types.ObjectId.isValid(playlistId) ||
        !videoId || !mongoose.Types.ObjectId.isValid(videoId)
    ) {
        throw new ApiError(400, "Invalid playlist ID or video ID")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    ).populate("videos", "title description")

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Video removed from playlist successfully.")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.")
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if (!deletedPlaylist) {
        throw new ApiError(404, "Playlist not found or already deleted.")
    }

    return res.status(200).json(
        new apiResponse(200, deletedPlaylist, "Playlist deleted successfully.")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID.")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name, description },
        { new: true }
    )

    if (!updatedPlaylist) {
        throw new ApiError(404, "Playlist not found.")
    }

    return res.status(200).json(
        new apiResponse(200, updatedPlaylist, "Playlist updated successfully.")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
