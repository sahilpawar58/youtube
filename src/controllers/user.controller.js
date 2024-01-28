import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import {uploadCloudinary} from '../utils/cloudinary.js';
import ApiResponse from "../utils/ApiResponse.js";
import jsonwebtoken from "jsonwebtoken";
<<<<<<< HEAD
import mongoose from "mongoose";
=======
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954

const registerUser = asyncHandler(async (req,res)=>{
    //get payload
    const {username,fullName,email,password} = req.body;
    console.log(req.body);
    //check payload
    if(
        [username,fullName,email,password].some((field) => field?.trim() === "" || field === undefined)
    ){
        throw new ApiError("Please fill all fields",400);
    }
    //check user present already
    let user = await User.findOne({
        $or:[{username},{email}]
    })

    if(user){
        throw new ApiError("You already have an account",409);
    }

    //upload avatar ,check
    
    try{
        let temp = req.files?.avatar[0]?.path;
        
    }catch(err){
        throw new ApiError("Avatar file not found",400);
    }
    const avatarLocal = req.files?.avatar[0]?.path;

    let coverImageLocal="";
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage >1){
        coverImageLocal = req.files.coverImage[0].path;
        if(!coverImageLocal){
            throw new ApiError("Error uploadin file to server",400)
        }
    }

    const avatarCloud = await uploadCloudinary(avatarLocal);
    const coverCloud = await uploadCloudinary(coverImageLocal);

<<<<<<< HEAD
    if(!avatarCloud?.url){
=======
    if(avatarCloud == null){
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
        throw new ApiError("Server error",504);
    }
    //create user obj
    user = await User.create({
        username:username.toLowerCase(),
        email,
        fullName,
        password,
<<<<<<< HEAD
        avatar:avatarCloud.url,
        coverImage:coverCloud?.url,
=======
        avatar:avatarCloud,
        coverImage:coverCloud,
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
    })

    const userPresent = await User.findOne({
        id:user._id
    })

    if(!userPresent){
        new ApiError("Something went wrong when creating user",504);
    }
    //send response
    return res.status(201).json(
        new ApiResponse(200,userPresent,"Account Created Successfully")
    )
    
})

<<<<<<< HEAD
const generateAccessTokenandRefreshToken = async(userId)=>{

    let user = await User.findById(userId);

    if(!user){
        new ApiError("Account not Found");
    }
=======
const generateAccessTokenandRefreshToken = async(user)=>{
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

<<<<<<< HEAD
    let userUpdated = await user.save({ validateBeforeSave: false },{new:true});

    // delete user.refreshToken;
    console.log(typeof(user))


    return {userUpdated,accessToken,refreshToken};
=======
    await user.save({ runValidators: true });

    return {accessToken,refreshToken};
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954

}
const loginUser = asyncHandler(async(req,res) =>{
    //get param
    const {username,email,password} = req.body;

    //check param
    if((username == "" || username == undefined) && (email == "" || email == undefined)){
        throw new ApiError("Enter email or username");
    }

    //user exist?
    const user  = await User.findOne({
        $or:[{username},{email}]
    })

    //password check
    const passbool = await user.passwordCheck(password);
    if(!passbool){
        throw new ApiError("Password Incorrect");
    }

    //generate accesstoken
    const {accessToken,refreshToken} = await generateAccessTokenandRefreshToken(user);

    const userUpdated  = await User.findOne({
        _id:user._id
<<<<<<< HEAD
    },'-password -watchHistory -refreshToken')

    userUpdated.accessToken = accessToken;
    userUpdated.save({validateBeforeSave:false})

    res.cookie("accessToken",accessToken);
    res.cookie("refreshToken",refreshToken);

    return res.status(200).json(
        new ApiResponse(200,
        {
        user:userUpdated,
        accessToken,
        refreshToken
    },"User logged Successfully"))
})

const logoutUser = asyncHandler(async(req,res) => {
    //get user id
    // console.log(req.user);
    //delete refresh token
    
    let user = await User.findByIdAndUpdate(req.user._id,{$unset:{refreshToken:1}})

    // user.refreshToken="";
    // user.save({ runValidators: false });

    res.clearCookie(["accessToken","refreshToken"]);
    res.status(200).json(
        new ApiResponse(200,user,"Logged out successfully")
    )

})

const refreshAcessToken = asyncHandler(async(req,res) =>{
    const token = req.cookies.refreshToken || req.body.refreshToken

    try {
        const userid = jsonwebtoken.verify(token,process.env.REFRESH_TOKEN_SECRET);
    
        if(!userid){
            throw new ApiError("Invalid Token Given");
        }
    
        let user = await User.findById(userid);
    
        if(token !== user.refreshToken){
            throw new ApiError("Invalid Token Found");
        }
    
        const {userUpdated,accessToken,refreshToken} = await generateAccessTokenandRefreshToken(userid);
    
    
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
    
        const option = {
            httpOnly: true,
            secure: true
        }
    
        res.cookie("accessToken",accessToken,option);
        res.cookie("refreshToken",refreshToken,option);
    
    
        return res
        .status(200)
        .json({accessToken,refreshToken})
    } catch (error) {
        throw new ApiError(error || "Error while refreshing token")
    }
})

//reset email, fullname
const resetTextProfile = asyncHandler(async(req,res) =>{

})
//reset username
const resetUsername = asyncHandler(async(req,res) => {
    const {username} = req.body;

    await User.updateOne({_id:req.user._id},{
        $set:{
            username
        }
    })

    res
    .status(200)
    .json(new ApiResponse(200,"username updated"))
})
//reset password
const resetPassword = asyncHandler(async(req,res) => {
    const {oldPassword,newPassword} = req.body;

    const user = await User.findById(req.user._id);

    let passConf = await user.passwordCheck(oldPassword);

    if(!passConf){
        throw new ApiError("Incorrect password",401);
    }

    user.password = newPassword;
    user.save({runValidators:false});

    res
    .status(200)
    .json(new ApiResponse(200,"Password updated Successfully"));
})
//reset avatar
const resetavatar = asyncHandler(async(req,res) =>{
    const avatar = req.file?.path;

    if(!avatar){
        throw new ApiError("plz upload file");
    }

    let user = await User.findById(req.user.id);

    user.avatar = await uploadCloudinary(avatar).url;
    user.save({validateBeforeSave:false});

    res
    .status(200)
    .json(new ApiResponse(200,"Avatar has been reset"));
})
//reset coverimage
const resetcoverImage = asyncHandler(async(req,res) =>{
    const coverImage = req.file?.path;

    if(!coverImage){
        throw new ApiError("plz upload file");
    }

    let user = await User.findById(req.user.id);

    user.coverImage = await uploadCloudinary(coverImage).url;
    user.save({validateBeforeSave:false});

    res
    .status(200)
    .json(new ApiResponse(200,"coverImage has been reset"));
})

const getUserChannelProfile = asyncHandler(async(req,res) => {

    const {username} = req.params;
    let channel = await User.aggregate([
        {$match : {"username":username}},
        {$lookup : {
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }},
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscriptedTo"
            }
        },
        {
            $addFields: {
                subcriberCount: {
                    $size:"$subscribers"
                }
            }
        },
        {
            $addFields: {
                subcribedtoCount: {
                    $size:"$subscriptedTo"
                }
            }
        }, 
        {
            $addFields: {
                isSubscripted:{
                    $cond: {
                        if: {$in:[username,"$subscriptedTo.channel"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                "username":1,
                "email":1,
                'fullName':1,
                "avatar":1,
                "coverImage":1,
                "subcribedtoCount":1,
                "subcriberCount":1,
                "isSubscripted":1
            }
        }
    ])

    if(!channel?.length){
        new ApiError("channel does not exist",404);
    }

    return res
    .status(200)
    .json(new ApiResponse(200,channel[0],"channel fetchedd successfully"));
})

const getUserHistory =asyncHandler(async(req,res) => {
    let videoHistory = await User.aggregate([
        {
            $match:{
            "_id": new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $project:{
                "watchHistory":1,
                
            },
        },
        {
            $unwind:"$watchHistory",
        },
        {$lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"historyDetails",
            pipeline:[
                {
                    $project:{
                        "videoFile":1,
                        "thumbnail":1,
                        "duration":1,
                        "title":1,
                        "owner":1
                    }
                },
                {
                    $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"userdetails",
                    pipeline:[
                        {$project:{
                            "_id":1,
                            "username":1,
                            "avatar":1
                        }}
                    ]
                }}
            ],
        }},
        {
            $addFields: { historyDetails: { $first: "$historyDetails" } }
        }
    ])
    // console.log();
    return res
    .status(200)
    .json(new ApiResponse(200,videoHistory,"History Fetched successfully"))
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAcessToken,
    resetPassword,
    resetUsername,
    resetavatar,
    resetcoverImage,
    getUserChannelProfile,
    getUserHistory
};
=======
    },'-password -watchHistory')

    userUpdated.accessToken = accessToken;

    return res.status(200).json({
        userUpdated
    });
})

export {registerUser,loginUser};
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
