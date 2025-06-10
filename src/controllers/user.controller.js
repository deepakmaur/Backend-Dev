import { APIError } from "openai/index.mjs"
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudniary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken=async (userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"It's not you it's us")
    }
}

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

const loginUser= asyncHandler(async (req,res)=>{
    // req body-> data
    //username or email
    //find the user
    //password check
    //access token and refresh toaken
    //send cookie

    const {username, email, password}=req.body;

    if(!username || !email){
         throw new ApiError(400,"username or email is required")
    }

    const user=User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new APiError(404,"Username or Email does not exist")
    }

    const isPasswordValid=await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Password Incorrect")
    }

    const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id);

    const loggedIn=User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json((
        new ApiResponse(
            200,
            {
                user: loginUser,accessToken, refreshToken
            },
            "user logged in SuccessFully"
        )
    ))
})


export {registerUser, loginUser} 