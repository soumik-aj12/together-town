import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import dotenv from "dotenv";
import { GetAllUsers, Signin, Signup } from "../controller/Authentication";
import { getAllAvatars, getElements } from "../controller";

export const router = Router();
dotenv.config();

router.post("/signup",Signup);
router.post("/signin", Signin);
router.get("/getAllUsers",GetAllUsers);
router.get("/avatars",getAllAvatars);
router.get("/elements",getElements);
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/space", spaceRouter);