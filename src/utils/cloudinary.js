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
<<<<<<< HEAD
        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto",media_metadata:true});
        // console.log(`File uploaded succesfully: `+response.url);
        return response;
=======
        const response = await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto"});
        // console.log(`File uploaded succesfully: `+response.url);
        return response.url;
>>>>>>> 7dcb05844c2ae8314d3ca6ab2cf489e7300eb954
    }catch(err){
        unlinkSync(localFilePath);
        console.log(`Cloudinary Error: `+err);
    }
}

const deleteCloudinaryImg = async function(cloudFilePath){
    try{
        if(!cloudFilePath) return null;
        console.log(cloudFilePath)
        await cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const response = await cloudinary.uploader.destroy(cloudFilePath,{ resource_type: "auto"});
        // console.log(`File uploaded succesfully: `+response.url);
        return response;
    }catch(err){
        // unlinkSync(cloudFilePath);
        console.log(`Cloudinary Error: `+JSON.stringify(err));
    }
}
const deleteCloudinaryVideo = async function(cloudFilePath){
    try{
        if(!cloudFilePath) return null;
        console.log(cloudFilePath)
        await cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        const response = await cloudinary.uploader.destroy(cloudFilePath,{ resource_type: "video"});
        // console.log(`File uploaded succesfully: `+response.url);
        return response;
    }catch(err){
        // unlinkSync(cloudFilePath);
        console.log(`Cloudinary Error: `+JSON.stringify(err));
    }
}
export {uploadCloudinary,deleteCloudinaryImg,deleteCloudinaryVideo};


