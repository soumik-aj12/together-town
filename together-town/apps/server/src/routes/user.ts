import { Router } from "express";
import { GetAllUserMetadata, UserMetadata } from "../controller/User";
import { userMiddleware } from "../middleware/user";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, UserMetadata);

userRouter.post("/metadata/bulk",GetAllUserMetadata);