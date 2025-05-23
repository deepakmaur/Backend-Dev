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

    const {fullName,email,username,password}=req.body
    console.log("email ",email)

    if(
        [fullName,email,username,password].some((field)=>field?.trim==="")
    ){
        throw new ApiError(400,"All fields are Required")
    }

    // Instead of checking first username then email we can check both simultanesouly

    const existedUser=User.findOne(  
        {
            $or : [{username},{email}]
        }
    )
    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const avatarImageLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarImageLocalPath){
        throw new ApiError(400,"Avatar file is needed")
    }

    const avatar = await uploadOnCloudinary(avatarImageLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is needed")
    }

    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.tolower()
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