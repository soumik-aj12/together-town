import { Request, Response } from "express";
import { CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from "../types/schemas";
import client from "@repo/db/client";
import { log } from "node:console";
export const CreateElement = async (req:Request,res:Response) => {
    try {
        const parsedData = CreateElementSchema.safeParse(req.body);
        if (!parsedData.success) {
            res.status(400).json({error: true, message: "Validation failed!"});
            return;
        }
        const element = await client.element.create({
            data:{
                width: parsedData.data.width,
                height: parsedData.data.height,
                imageUrl: parsedData.data.imageUrl,
                static: parsedData.data.static,

            }
        });        
        res.status(200).json({error: false, message: "Element Created!", id: element.id});
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const UpdateElement = async (req:Request,res:Response) => {
    try {
        const updateData = UpdateElementSchema.safeParse(req.body);
        if (!updateData.success) {
            res.status(400).json({error: true, message: "Validation failed!"});
            return;
            }
            const element = await client.element.update({
                where: { id: req.params.elementId },
                data:{
                    imageUrl: updateData.data.imageUrl,
                    height: updateData.data.height,
                    width: updateData.data.width,
                    static: updateData.data.static
                }
            });
            res.status(200).json({error: false, message: "Element Updated!",id: element.id} );
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const AddAvatar = async (req:Request,res:Response) => {
    try {
        const AddAvatarData = CreateAvatarSchema.safeParse(req.body);
        if (!AddAvatarData.success) {
            res.status(400).json({error: true, message: "Validation failed!"});
            return;
            }
        const avatar = await client.avatar.create({
            data:{
                name: AddAvatarData.data.name,
                imageUrl: AddAvatarData.data.imageUrl
            }
        });
        res.status(200).json({error: false, message: "Avatar Created!", id: avatar.id});
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}

export const AddMap = async (req:Request,res:Response) => {
    try {
        const AddMapData = CreateMapSchema.safeParse(req.body);
        if (!AddMapData.success) {
            res.status(400).json({error: true, message: "Validation failed!"});
            return;
            }
            const map = await client.map.create({
                data:{
                    name: AddMapData.data.name,
                    width: parseInt(AddMapData.data.dimensions.split("x")[0]), 
                    height: parseInt(AddMapData.data.dimensions.split("x")[1]),
                    thumbnail: AddMapData.data.thumbnail,
                    maps:{
                        create: AddMapData.data.defaultElements.map(ele=>({
                            elementId: ele.elementId,
                            x: ele.x,
                            y: ele.y
                        }))
                    }
                }
            });
            res.status(200).json({error: false, message: "Map Created!", id: map.id});
    } catch (error) {
        res.status(404).json({error: true, message: "Internal Server Error"})
        
    }
}