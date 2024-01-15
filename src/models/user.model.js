import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import {ApiError} from "../utils/ApiError.js"
import jsonwebtoken from 'jsonwebtoken';

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        index:true,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required!!"],
    },
    fullName:{
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video",
            viewedTill:Number
        }
    ],
    refreshToken:{
        type:String
    },
},
{
    timestamps:true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,8);
    next();
});

userSchema.method('passwordCheck',async function(password){
    return await bcrypt.compare(password,this.password);
})

userSchema.method('generateAccessToken',function(){
    return jsonwebtoken.sign({
        _id:this._id,
        email:this.email,
        username:this.password,
        fullName:this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
})

userSchema.method('generateRefreshToken',function(){
    return jsonwebtoken.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
})


export const User = new mongoose.model("User",userSchema);