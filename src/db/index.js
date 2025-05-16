import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";

// Load environment variables BEFORE using them
//dotenv.config({ path: "../../.env" }); 

// - If your .env file is in the root, but your script runs inside src/db/, try specifying the path in dotenv.config():



export const connection=async()=>{
    try {
        console.log("MongoDB URI:", process.env.MONGODB_URI);
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDb Connected || DB Host ${connectionInstance.connection.host}`)
        //console.log(connectionInstance)
    } catch (error) {
        console.log("Error in Connection: ",error);
        process.exit(1);
    }
}

