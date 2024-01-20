import {v2 as cloudinary} from 'cloudinary';
import fs, { unlinkSync } from 'fs';
          

const uploadCloudinary = async function(localFilePath){
    try{
        if(!localFilePath) return null;
        console.log(localFilePath)
        await cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto"});
        // console.log(`File uploaded succesfully: `+response.url);
        return response.url;
    }catch(err){
        unlinkSync(localFilePath);
        console.log(`Cloudinary Error: `+err);
    }
}

export {uploadCloudinary};


