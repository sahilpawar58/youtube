import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadCloudinary,deleteCloudinaryVideo} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy='createdAt desc', sortType='asc', userId } = req.query;
    const options = {
        page,
        limit,
        offset:page,
        sort:sortBy,
      };
    // console.log(req.user);
    var myAggregate = await Video.aggregate([
        {$match:{owner:userId}}
    ]);
    await Video
    .aggregatePaginate(myAggregate, options)
    .then(function (results) {
        return res
        .status(200)
        .json(new ApiResponse(200,results,"Query Executed Succesfully"));
    })
    .catch(function (err) {
        throw new ApiError(err || "error executing pagination",500);
    });
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    try {
        const videoFile = req?.files?.videoFile[0].path;
        const thumbnail = req?.files?.thumbnail[0].path;
    
        if(!videoFile  || !thumbnail){
            throw new ApiError("Plz upload file",400);
        }
    
        if(!title || !description){
            throw new ApiError("title or description not found",400);
        }
    
        const videoFileCloud = await uploadCloudinary(videoFile);
        const thumbnailCloud = await uploadCloudinary(thumbnail);
    
        if(!videoFileCloud?.url){
            throw new ApiError("Error while uploading video",500)
        }
    
        if(!thumbnailCloud?.url){
            throw new ApiError("Error while uploading thumbnail",500)
        }
        console.log(videoFileCloud)
        let video = await Video.create({
            videoFile:videoFileCloud.url,
            public_id:videoFileCloud.public_id,
            thumbnail:thumbnailCloud.url,
            owner:req.user._id,
            title:title,
            description:description,
            duration:videoFileCloud.duration
        })
    
        return res
        .status(200)
        .json(new ApiResponse(200,video,"video uploaded successfully"))
    } catch (error) {
        throw new ApiError(error || "error while uploading file");
    }

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!videoId){
        return new ApiError("no videoId provided",400);
    }
    let video = await Video.findById(videoId);
    // console.log(video);
    // let user = await User.findById(req.user._id);

    if(!video){
        throw new ApiError("Invalid Id provided",404)
    }

    await User.findById(req.user._id);
    const result = await User.updateOne(
        { _id: req.user._id },
        {
          $push: {
            watchHistory: {
              _id: videoId, // Assuming videoId is the unique identifier for videos
            }
          }
        }
    );

    if(!result){
        throw new ApiError("Error adding video to history");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video,"Video Fetched Successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!videoId){
        throw new ApiError("no video Id found",400);
    }
    const video = await Video.findById(videoId);

    await deleteCloudinary(video.ur)
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError("no video Id found",400);
    }
    try {
        let video = await Video.findById(videoId);
        if(!video){
            throw new ApiError("video not found  in  mongo",500);
        }
        const public_id = video?.public_id;
        let mongovideo = await Video.deleteOne({_id:videoId});
        if(!mongovideo){
            throw new ApiError("video not found  in  mongo",500);
        }
        console.log(video)
        let cloudinaryvideo = await deleteCloudinaryVideo(public_id);
        if(!cloudinaryvideo){
            throw new ApiError("Error while deleting video from cloudinary",500)
        }
        return res
        .status(200)
        .json(new ApiResponse(200,video,"Deleted successfully"));
    } catch (error) {
        throw new ApiError(error  || "Error while deleting video",500);
    }

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let video = await Video.findById(videoId);
    if(!video){
        throw new ApiError("Video not found",404);
    }
    if(video.isPublised){
        video.isPublised=false;
    }else{
        video.isPublised=true;
    }
    const updatedvideo = await video.save({validateBeforeSave:false});

    if(!updatedvideo){
        throw new ApiError("error while updating Publish status",500);
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{
        updatedStatus:updatedvideo.isPublised
    },"Status Updated"));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}