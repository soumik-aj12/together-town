import { WebSocket } from "ws"
import { OutgoingMessage } from "./types";
import { Rooms } from "./Rooms";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function getRandomString(length: number){
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
}

export class User{
    public id: string;
    public userId?: string;
    private spaceId?: string;
    public x: number;
    public y: number;
    constructor(private ws: WebSocket){
        this.x = 0; 
        this.y = 0;
        this.id = getRandomString(10);
        this.initHandlers();
    }
    initHandlers(){
        this.ws.on("message", async (data)=>{
            const parsedData = JSON.parse(data.toString());
            switch (parsedData.type){
                case "join":
                    const spaceId = parsedData.payload.spaceId;
                    const token = parsedData.payload.token;
                    const userId = (jwt.verify(token, process.env.JWT_HASH!) as JwtPayload).userId;
                    if(!userId){
                        this.ws.send(JSON.stringify({type: "error", payload: {message: "Invalid token"}}));
                        return;
                    }
                    Rooms.getInstance().addUser(spaceId, this);
                    const space = await client.space.findFirst(
                        {
                            where: {
                                id: spaceId
                            }
                        }
                    );
                    if(!space){
                        this.ws.close(); 
                        return;
                    }
                    this.spaceId = spaceId;
                    this.send({
                        type: "space-joined",
                        payload: {
                            spaceId,
                            userId: this.id,
                            payload:{
                                spawn: {
                                    x: Math.floor(Math.random()*space?.width!),
                                }
                            },
                            users: Rooms.getInstance().rooms.get(spaceId)?.map((u)=>({id: u.id}))

                        }
                    });
                    Rooms.getInstance().broadcast({
                        type: "user-joined",
                        payload: {
                            userId: this.id,
                            x: this.x!,
                            y: this.y!
                        }
                    }, this, spaceId)
                    break;
                case "move":
                    const moveX = parsedData.payload.x;
                    const moveY = parsedData.payload.y;
                    const xDisplacement = Math.abs(this.x - moveX);
                    const yDisplacement = Math.abs(this.y - moveY);
                    
                    
                    if(xDisplacement === 1 && yDisplacement === 0 || xDisplacement === 0 && yDisplacement === 1){
                        this.x = moveX;
                        this.y = moveY;
                        Rooms.getInstance().broadcast({
                            type: "move",
                            payload: {
                                x: this.x,
                                y: this.y
                            }
                        },this, this.spaceId!);
                        return;
                    }
                    this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y,
                        }
                    })
            }
        })
    }
    destroy(){
        Rooms.getInstance().broadcast({
            type: "user-left",
            payload: {
                userId: this.id
            }
            }, this, this.spaceId!);

        Rooms.getInstance().removeUser(this, this.spaceId!);
    }
    send(payload:OutgoingMessage){
        this.ws.send(JSON.stringify(payload));
    }
} 