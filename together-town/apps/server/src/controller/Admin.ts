import { Request, Response } from "express";
import { CreateElementSchema } from "../types/schemas";

export const CreateElement = async (req:Request,res:Response) => {
    try {
        const parsedData = CreateElementSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({error: true, message: "Validation failed!"})
        }
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const UpdateElement = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const AddAvatar = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const AddMap = async (req:Request,res:Response) => {
    try {
        
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}