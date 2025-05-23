import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const userRouters = Router();
userRouters.route("/register").post(registerUser)


export default userRouters;
