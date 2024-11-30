
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config()
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];
    
    if (!token) {
        res.status(400).json({message: "Unauthorized"})
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_HASH!) as { role: string, userId: string }
        req.userId = decoded.userId
        next()
    } catch(e) {
        res.status(400).json({message: "Unauthorized"})
        return
    }
}