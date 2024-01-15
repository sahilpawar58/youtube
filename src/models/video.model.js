import mongoose,{Schema} from "mongoose";

const videoSchema = Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true 
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublised:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
})