import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

// import dotenv from "dotenv";

// // Load environment variables BEFORE using them
// dotenv.config({ path: "../../.env" });

cloudinary.config({
    cloud_name:process.env.CLOUDNIARY_CLOUD_NAME,
    api_key:process.env.CLOUDNIARY_API_KEY,
    api_secret:process.env.CLOUDNIARY_SECRET_KEY
})

export const uploadOnCloudinary=async (localFilePath)=>{
    localFilePath=path.resolve(localFilePath)
    try {
        if(!localFilePath) return null;
        // upload the file
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // file is uploaded
        //console.log("File is uploaded ",response.url)

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath);
        // remove the local saved temporary file as the upload operation got failed it's included as a good practice
    }
}

// const filePath = path.resolve("C:/Users/DEEPAK/Downloads/edited.jpg");
// uploadOnCloudinary(filePath);

