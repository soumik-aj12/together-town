import { Request, Response } from "express";
import { AddElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../types/schemas";
import client from "@repo/db/client";
export const CreateSpace = async (req:Request, res:Response) => {
    const data = CreateSpaceSchema.safeParse(req.body);
    if(!data.success){
        res.status(400).json({error:true, message:"Validation Failed!"});
        return;
    }
    if(!data.data.mapId){
        const space = await client.space.create({
            data:{
                name: data.data.name,
                width: parseInt(data.data.dimensions.split("x")[0]),
                height: parseInt(data.data.dimensions.split("y")[1]),
                creatorId: req.userId!
            }
        });
        res.status(200).json({error: false, message: "Space Created!", spaceId: space.id})
    }

    const map = await client.map.findUnique({
        where: {
            id: data.data.mapId
        },
        select:{
            maps: true,
            height: true,
            width: true
        }
    });
    if(!map){
        res.status(404).json({error:true, message:"Map Not Found!"});
    }
    let space = await client.$transaction(async ()=>{
        const space = await client.space.create({
            data:{
                name: data.data.name,
                width: map?.width!,
                height: map?.height!,
                creatorId: req.userId!
            }
        });

        await client.spaceElements.createMany({
            data:map!.maps.map((ele)=>({
                spaceId: space.id,
                elementId: ele.id,
                x: ele.x!,
                y: ele.y!,
            }))
        });
        return space;
    });
    res.status(200).json({error: false, message: "Space Created", spaceId: space.id})

}

export const DeleteSpace = async (req:Request, res:Response) => {
    const space = await client.space.findUnique({
        where:{
            id: req.params.id
        },
        select:{
            creatorId: true
        }
    });
    if(!space){
        res.status(400).json({error:true, message:"Space doesn't exist."});
        return;
    }
    if(space?.creatorId!==req.userId){
        res.status(403).json({error:true, message:"You don't have permission to delete!"});
        return;
    }
    await client.space.delete({
        where:{
            id: req.params.id
        }
    });
    res.status(200).json({error:false, message:"Space deleted!"});
}

export const GetAllSpaces = async (req:Request, res:Response) => {
    try {
        const spaces = await client.space.findMany({
            where:{
                creatorId: req.userId
            }
        });
        res.status(200).json({error: true, spaces: spaces.map((space)=>({
            id: space.id,
            name: space.name,
            thumbnail: space.thumbnail,
            dimensions: `${space.width}×${space.height}`
        }))})
    } catch (error) {
        res.status(400).json({error: true, message: "Internal Server Error!"})
    }
}

export const AddElementInSpace = async (req:Request, res:Response) => {
    const parseData = AddElementSchema.safeParse(req.body);
    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId,
            creatorId: req.userId
        },select:{
            width: true,
            height: true
        }
    });
    if(!space){
        res.status(400).json({error: true, message: "Space not found!"})
    }

    await client.spaceElements.create({
        data:{
            spaceId: parseData.data?.spaceId!,
            elementId: parseData.data?.elementId!,
            x: parseData.data?.x!,
            y: parseData.data?.y!,
        }
    });
    res.status(200).json({error:false, message:"Element added to space!"});
}

export const DeleteElementInSpace = async (req:Request, res:Response) => {
    const parseData = DeleteElementSchema.safeParse(req.body);
    const spaceElement = await client.spaceElements.findFirst({
        where:{
            id: parseData.data?.elementId
        },
        include:{
            space: true
        }
    });

    if(!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId){
        res.status(400).json({error: true, message: "You don't have permission"});
        return;
    }
    await client.spaceElements.delete({
        where:{
            id: parseData.data?.elementId
        }
    });
    res.status(200).json({error: false, message: "Element Deleted!"})

}

export const GetArenaSpace = async (req:Request, res:Response) => {
    const space = await client.space.findUnique({
        where:{
            id: req.params.spaceId
        },
        include:{
            elements:{
                include:{
                    element: true
                }
            }
        }
    });

    if(!space){
        res.status(404).json({error: true, message: "Space not found!"});
    }
    res.status(200).json({
        error: false,
        data:{
            dimensions:`${space?.width}×${space?.height}`,
            elements: space?.elements.map((e)=>({
                id: e.id,
                element: {
                    id: e.element.id,
                    height: e.element.height,
                    width: e.element.width,
                    imageUrl: e.element.imageUrl,
                    static: e.element.static
                },
                x: e.x,
                y: e.y,
            }))
        }
    })
}
