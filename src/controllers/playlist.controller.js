import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import {User} from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;

    if(!name || !description){
        throw new ApiError("name or description not provided");
    }
    await Playlist.create({
        name,
        description,
        owner:req.user._id
    }).then(()=>{
        res
        .status(200)
        .json(new ApiResponse(200,"playlist created successfully"))
    }).catch((error) => {
        throw new ApiError(error || "error creating playlist",500)
    })

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError("Invalid UserId provided",400);
    }
    let playlist = await Playlist.aggregate([
        {$match:{_id: new mongoose.Types.ObjectId(userId)}},
        {$lookup:
            {from:"videos",
            localField:"videos",
            foreignField:"_id",
            as:"videoDetails",
            pipeline:[
                {$project:{
                    "_id":1,
                    "videoFile":1,
                    "owner":1,
                    "title":1,
                    "thumbnail":1,
                    "duration":1,
                }},
                {$lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"videoCreatorDetails",
                    pipeline:[
                    {$project:{
                        "_id":1,
                        "username":1,
                        "avatar":1,
                        }}
                    ]
                }},
                {$project:{
                    "owner":0
                }}
            ]
        }},
        {$lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"playlistCreator",
            pipeline:[
                {$project:{
                    "username":1,
                    "fullName":1,
                    "avatar":1,
                }}
            ]
        }},
        {$project:{
            "videos":0,
            "owner":0
        }}
    ])
    
    if(!playlist){
        throw new ApiError("Error while fetching User's Playlist");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist Fetched succesfully"));
    
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;

    if(!playlistId){
        throw new ApiError("PlaylistId not provided",400);
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid PlaylistId Provided",400);
    }
    let isPlaylist = await Playlist.findById(playlistId);

    if(!isPlaylist){
        throw new ApiError("Playlist Not Found",404);
    }

    let playlist = await Playlist.aggregate([
        {$match:
            {_id: new mongoose.Types.ObjectId(playlistId)},
        },
        {$lookup:{
            from:"videos",
            localField:"videos",
            foreignField:"_id",
            as:"videoDetails",
            pipeline:[
                {$project:{
                    "_id":1,
                    "videoFile":1,
                    "owner":1,
                    "title":1,
                    "thumbnail":1,
                    "duration":1,
                }},
                {$lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"videoCreatorDetails",
                    pipeline:[
                    {$project:{
                        "_id":1,
                        "username":1,
                        "avatar":1,
                        }}
                    ]
                }},
                {$project:{
                    "owner":0
                }}
            ]
        }},
        {$lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"playlistCreator",
            pipeline:[
                {$project:{
                    "username":1,
                    "fullName":1,
                    "avatar":1,
                }}
            ]
        }},
        {$project:{
            "videos":0,
            "owner":0
        }}
    ]);


    if(!playlist){
        throw new ApiError("Invalid Playlist Id",400);
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist fetched Successfully"))
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;

    try {
        if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
            throw new ApiError("Invalid Playlist or videoId Provided");
        }
    
        let video = await Video.findById(videoId);
        if(!video){
            throw new ApiError("video Not Found",404);
        }
        let playlist = await Playlist.findById(playlistId);
        if(!playlist){
            throw new ApiError("Playlist Not Found",404);
        }
        let alreadyPresent = await Playlist.find({videos:{$in:[videoId]}});
        if(alreadyPresent.length !== 0){
            throw new ApiError("Video already exists in Playlist",400);
        }
        let addedPlaylist = await Playlist.updateOne(
            {_id:playlist},
            {$push:{videos:video}},
            { returnDocument: 'after' })
        if(!addedPlaylist){
            throw new ApiError("Error while Uploading to Playlist",500);
        }
        
        return res
        .status(200)
        .json(new ApiResponse(200,addedPlaylist,"Video added Successfully"))
    } catch (error) {
        throw new ApiError(error || "Error while Uploading to Playlist",500);
    }
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError("Invalid playlistId & videoId",400);
    }
    let video = await Video.findById(videoId);
    if(!video){
        throw new ApiError("video Not Found",404);
    }
    let playlist = await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError("Playlist Not Found",404);
    }
    console.log(video)
    await Playlist.updateOne(
        {_id:playlistId},
        { $pull: { videos: { $in: [videoId] } } } )
    .then(()=>{
        return res
        .status(200)
        .json(new ApiResponse(200,{videoId,playlistId},"Video removed Successfully"))
    })
    .catch((error) => {
        throw new ApiError(error || "Error deleting video from playlist",500)
    })
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid playlistId",400);
    }
    let isPlaylist = await Playlist.findById(playlistId);
    if(!isPlaylist){
        throw new ApiError("PlaylistId does not exist",500);
    }
    await Playlist.deleteOne({_id:playlistId})
    .then(() => {
        return res
        .status(200)
        .json(new ApiResponse(200,{playlistId},"Playlist deleted successfully"))
    })
    .catch((error) =>{
        throw new ApiError(error || "Error deleting Playlist",500);
    })
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!name || !description){
        throw new ApiError("Name or Description not provided",400);
    }
    if(!isValidObjectId(playlistId)){
        throw new ApiError("Invalid PlaylistId",400);
    }
    await Playlist.updateOne({_id:playlistId},{name,description})
    .then(()=>{
        return res
        .status(200)
        .json(new ApiResponse(200,{name,description},"Playlist Updated Successfully"))
    })
    .catch((error)=>{
        throw new ApiError(error || "Error updating playlist",500);
    })
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