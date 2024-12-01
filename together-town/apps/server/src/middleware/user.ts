
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config()
export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];
    console.log(header);
    
    
    
    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        console.log(token);
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_HASH!) as { role: string, userId: string }
        req.userId = decoded.userId
        next();
    } catch(e) {
        res.status(401).json({message: "Unauthorized"})
        return
    }
}