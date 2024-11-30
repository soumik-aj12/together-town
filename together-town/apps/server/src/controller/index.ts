import { Request, Response } from "express";
import client from "@repo/db/client";

export const getAllAvatars = async (req: Request, res: Response) => {
  try {
    const avatars = await client.element.findMany();
    res.status(200).json({
      error: false,
      avatars: avatars.map((avatar) => ({
        id: avatar.id,
        height: avatar.height,
        width: avatar.width,
        imageUrl: avatar.imageUrl,
        static: avatar.static,
      })),
    });
  } catch (error) {
    res.status(404).json({ error: true, message: "Internal Server Error!" });
  }
};

export const getElements = async (req: Request, res: Response) => {
  try {
    const elements = await client.element.findMany();
    res.status(200).json({
      error: false,
      elements: elements.map((element) => ({
        id: element.id,
        height: element.height,
        width: element.width,
        static: element.static,
        imageUrl: element.imageUrl,
      })),
    });
  } catch (error) {
    res.status(404).json({ error: true, message: "Internal Server Error!" });
  }
};