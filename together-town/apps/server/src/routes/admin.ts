import { Router } from "express";
import { adminMiddleware } from "../middleware/admin";
import { AddAvatar, AddMap, CreateElement, UpdateElement } from "../controller/Admin";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, CreateElement);

adminRouter.put("/element/:elementId",adminMiddleware, UpdateElement);

adminRouter.post("/avatar",adminMiddleware, AddAvatar);

adminRouter.post("/map", adminMiddleware, AddMap);