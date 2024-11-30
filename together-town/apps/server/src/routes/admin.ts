import { Router } from "express";
import { adminMiddleware } from "../middleware/admin";
import { AddAvatar, AddMap, CreateElement, UpdateElement } from "../controller/Admin";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, CreateElement);

adminRouter.put("/element",adminMiddleware, UpdateElement);

adminRouter.post("/avatar", AddAvatar);

adminRouter.post("/map", adminMiddleware, AddMap);