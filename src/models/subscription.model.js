import mongoose,{Schema, model} from "mongoose";

const subscription = new Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
})

export const Subscription = new model("Subscription",subscription);