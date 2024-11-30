import { Request,Response } from "express";
import { UpdateAvatarSchema } from "../types/schemas";
import client from "@repo/db/client";
const db = client;
export const UserMetadata = async (req: Request, res: Response) => {
    const avatarData = UpdateAvatarSchema.safeParse(req.body);
    const userId = req.userId;

    if(!avatarData.success){
        res.status(400).json({error:true, message: "Avatar Validation Failed"});
        return;
    }

    await db.user.update({
        where:{
            id: userId
        },
        data:{
            avatarId: avatarData.data.avatar
        }
    });

    res.status(400).json({error:false, message: "Metadata Updated!"});
}

export const GetAllUserMetadata = async (req: Request, res: Response) => {
    const userIds = (req.query.userIds ?? "[]") as string;
    const userIdsArr = (userIds).slice(1, userIds.length-2).split(",") ;

    const metadata = await db.user.findMany({
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