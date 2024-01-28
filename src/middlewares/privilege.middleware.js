import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const isPrivileged = asyncHandler(async(req,res,next) => {
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