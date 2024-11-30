import { Router } from "express";
import { AddElementInSpace, CreateSpace, DeleteElementInSpace, DeleteSpace, GetAllSpaces, GetArenaSpace } from "../controller/Space";
import { userMiddleware } from "../middleware/user";

export const spaceRouter = Router();

spaceRouter.post("/", userMiddleware, CreateSpace);

spaceRouter.delete("/:spaceId", userMiddleware, DeleteSpace);

spaceRouter.get("/all", userMiddleware, GetAllSpaces);

spaceRouter.get("/:spaceId",userMiddleware,GetArenaSpace);

spaceRouter.post("/element",userMiddleware, AddElementInSpace);

spaceRouter.delete("/element", DeleteElementInSpace)

// spaceRouter.get("/elements",(req,res)=>{
//     res.send("Add an element");
// })