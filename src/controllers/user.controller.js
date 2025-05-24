import { APIError } from "openai/index.mjs"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudniary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser=asyncHandler( async (req,res)=>{
    
    // get details from frontend
    //validation - not empty
    //check is user already exist : username and email
    //check for images ,check for avatar
    //upload them to cloudniary
    //create user object - create entry db
    // remove password and refresh token field from response
    //check for creation
    // return rs

    const {fullName,email,userName,password}=req.body
    console.log("email ",email)

    if(
        [fullName,email,userName,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are Required")
    }

    // Instead of checking first username then email we can check both simultanesouly

    const existedUser=await User.findOne(  
        {
            $or : [{userName},{email}]
        }
    )
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    //console.log(req.files)

    const avatarImageLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.length ? req.files.coverImage[0].path : undefined;


    

    if(!avatarImageLocalPath){
        throw new ApiError(400,"Avatar file is needed")
    }

    const avatar = await uploadOnCloudinary(avatarImageLocalPath);
    let coverImage;
if (coverImageLocalPath) {
  coverImage = await uploadOnCloudinary(coverImageLocalPath);
}


    if(!avatar){
        throw new ApiError(400,"Avatar file is needed")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        userName:userName.toLowerCase()
    })

    const userCreated=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!userCreated){
        throw new ApiError(500,"Something went wront while Registering the User")
    }

    return res.status(201).json(
        new ApiResponse(200,userCreated,"User Registerd Successfully")
    )

    
} )


export {registerUser} 