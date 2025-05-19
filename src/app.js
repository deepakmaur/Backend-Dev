import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))

// How we are going to store accept our data from frontedn in whihc formats

// Middleware to parse incoming JSON requests
// This allows the app to accept JSON data sent in requests with a limit of 16KB
app.use(express.json({ limit: "16kb" }));

// Middleware to parse incoming URL-encoded data (form submissions)
// The 'extended: true' option allows nested objects to be processed
// The limit ensures requests don’t exceed 16KB
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files (like images, CSS, and JavaScript)
// The "public" directory is where static assets are stored and accessible to the frontend
app.use(express.static("public"));


// This parses cookies sent in client requests and makes them accessible via re
app.use(cookieParser())
export { app }