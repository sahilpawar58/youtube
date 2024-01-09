import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
// require('dotenv').config();

function connectDB(){
    return new Promise((resolve,reject) => {
        return mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        .then((connectionInstance) => {
            console.log("Connection Successfull And  Connected To Port "+connectionInstance.connection.port);
        })
        .catch((err) => {
            console.log("MONGODB connection FAILED" ,err);
            process.exit(1);
        })
    })
}

export default connectDB;