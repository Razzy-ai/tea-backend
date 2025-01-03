import {v2 as cloudinary} from "cloudinary"
import { response } from "express";
import fs from "fs"

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    // uploading
    const uploadOncloudinary = async (localFilePath) => {
        try {
            if(!localFilePath) return null
            // upload the file on cloudinary
           const reponse = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("File is uploaded on cloudinary" , reponse.url);
            return response

            // file ie. img and avatar after successfully uploaded on cloudinary it should be removed from server

        } catch (error) {
            // remove the locally saved temporary file as the upload operation get failed
            fs.unlinkSync(localFilePath)
            return null
        }
    }
 

export {uploadOncloudinary}