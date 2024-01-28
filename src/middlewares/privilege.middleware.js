import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const isPrivileged = asyncHandler(async(req,res,next) => {
    const { videoId } = req.params;

    let video  = await Video.findById(videoId);
    if(!video){
        throw new ApiError("Video not Found");
    }

    if(req.user.id === video.owner){
        next()
    }

    throw new ApiError("Video does not belong to you",401);
})

const isPlaylistOwner = asyncHandler(async(req,res,next) => {
    const { playlistId } = req.params;

    let playlist  = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError("Playlist not Found");
    }

    if(req.user.id === playlist.owner){
        next()
    }

    throw new ApiError("Playlist does not belong to you",401);
})


export {isPrivileged,isPlaylistOwner};