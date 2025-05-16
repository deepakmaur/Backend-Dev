import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

console.log(process.env.PORT);
import { connection } from "./db/index.js";

connection();
 
/*
const app=express();

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("App is not able to connect DB : ",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is on Port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR: ",error);
        throw error;
    }
})() // iffi

app.get("/",(req,res)=>{
    
    res.send("hello")
})
    */