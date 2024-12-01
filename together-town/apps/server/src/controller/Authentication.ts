import client from "@repo/db/client";
import { compare, hash } from "../constants/scrypt";
import { SigninSchema, SignupSchema } from "../types/schemas";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
export const Signup = async (req: Request,res: Response)=>{
    const data = SignupSchema.safeParse(req.body);
    // console.log(req.body);
    
    if (!data.success) {
        res.status(400).json({error:true, message: "Validation failed"})
        return
    }
    try {
        const userExists = await client.user.findFirst({
            where:{
                email: data.data.email
            }
        })
        if(userExists){
            res.status(400).json({error:true, message: "Email already in use!"})
            return
        }
        const hashedPwd = await hash(data.data.password);
        
        await client.user.create({
            data:{
                email: data.data.email,
                username: data.data.username,
                password: hashedPwd,
                role: data.data.role === "admin" ? "Admin" : "User",
            }
        })
        console.log("Registration complete! You can now login.");
        
        res.status(200).json({error: false, message:"Registration complete! You can now login."});
    } catch (error) {
        console.log(error);
        res.status(400).json({error:true, message: "Internal Server Error"})
        
    }
}

export const Signin = async (req: Request,res: Response)=>{
    const data = SigninSchema.safeParse(req.body);
    
    if (!data.success) {
        res.status(400).json({error:true, message: "Validation failed"})
        return
    }
    try {
        const user = await client.user.findUnique({
            where:{
                email: data.data.email
            }
        })
        if(!user){
            res.status(400).json({error:true, message: "User not found!"})
            return
        }
        const isValid = await compare(data.data.password, user.password)

        if (!isValid) {
            res.status(403).json({error: true, message: "Invalid password!"});
            return
        }
        const token = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_HASH!)

        
        res.json({error: false, message:`Welcome back, ${user.username}!`, token: token});
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"});
    }
}

export const GetAllUsers = async (req: Request,res: Response)=>{
    try {
        const Response = await client.user.findMany({});
        res.json({error: false, message: "Users fetched successfully", data: Response});
    } catch (error) {
        res.json({error: true, message: "Couldn't fetch successfully"});
        
    }
}