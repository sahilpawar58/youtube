import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from '../models/user.model.js';
import {uploadCloudinary} from '../utils/cloudinary.js';
import ApiResponse from "../utils/ApiResponse.js";
import jsonwebtoken from "jsonwebtoken";

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

    if(avatarCloud == null){
        throw new ApiError("Server error",504);
    }
    //create user obj
    user = await User.create({
        username:username.toLowerCase(),
        email,
        fullName,
        password,
        avatar:avatarCloud,
        coverImage:coverCloud,
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

const generateAccessTokenandRefreshToken = async(user)=>{

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ runValidators: true });

    return {accessToken,refreshToken};

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
    },'-password -watchHistory')

    userUpdated.accessToken = accessToken;

    return res.status(200).json({
        userUpdated
    });
})

export {registerUser,loginUser};
