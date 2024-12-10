import { Request,Response } from "express";
import { UpdateAvatarSchema } from "../types/schemas";
import client from "@repo/db/client";
export const UserMetadata = async (req: Request, res: Response) => {
    const avatarData = UpdateAvatarSchema.safeParse(req.body);
    const userId = req.userId;

    if(!avatarData.success){
        res.status(400).json({error:true, message: "Avatar Validation Failed"});
        return;
    }
    try {
        await client.user.update({
            where:{
                id: userId
            },
            data:{
                avatarId: avatarData.data.avatarId
            }
        });
        res.status(200).json({error:false, message: "Avatar Updated!"});
    } catch (error) {
        res.status(400).json({error:true, message: "Internal Server Error!"});
        
    }
}

export const GetAllUserMetadata = async (req: Request, res: Response) => {
    const userIds = (req.query.userIds ?? "[]") as string;
    const userIdsArr = (userIds).slice(1, userIds.length-1).split(",") ;
    
    const metadata = await client.user.findMany({
        where:{
            id:{
                in:userIdsArr
            }
        },
        select:{
            avatar: true,
            id: true
        }
    });    
    res.status(200).json({error: false, data: metadata.map((m)=>({
        userId: m.id,
        avatarId: m.avatar?.imageUrl
    }))});
}