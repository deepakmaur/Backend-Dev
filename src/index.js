import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

console.log(process.env.PORT);
import { connection } from "./db/index.js";

// asynce returns a promise
connection()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on Port ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("Error in connecting :",err)
    process.exit(1)
})
 

app.on("error", (error) => {
    console.error("App encountered an error:", error);
    process.exit(1);
});

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