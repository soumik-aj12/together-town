import { Router } from "express";
import { GetAllUserMetadata, UserMetadata } from "../controller/User";
import { adminMiddleware } from "../middleware/admin";

export const userRouter = Router();

userRouter.post("/metadata", adminMiddleware, UserMetadata);

userRouter.post("/metadata/bulk",GetAllUserMetadata);

userRouter.post("/avatars",(req,res)=>{
    res.send("Avatars");
})