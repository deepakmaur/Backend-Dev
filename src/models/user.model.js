import { Schema } from "mongoose";
import mongoose  from "mongoose";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"


const userSchema=new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true      // when you want to enable a searching field then add this line not necessary but it will optimize it
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,     // cloudinary url
            required:true

        },
        coverImage:{
            type:String, //cloudinary url
            
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"video"
            }
        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String,
        }

    },
    {
        timestamps:true
    }
)

//pre hook
userSchema.pre("save",async function(next){ // here don't use ()=>{} because this. is not accessible in arrow function
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()

})

// In Mongoose, schema.methods allows us to define instance methods that can be called on documents.

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=async function(){
    return jsonwebtoken.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,             //Payload
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=async function(){
    return jsonwebtoken.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model("User",userSchema)