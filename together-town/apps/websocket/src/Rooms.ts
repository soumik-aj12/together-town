import { User } from "./User";

export class Rooms{
    rooms: Map<string, User[]> = new Map();
    static instance: Rooms;
    private constructor() {
        this.rooms = new Map();
    }
    public static getInstance() {
        if(!this.instance){
            this.instance = new Rooms();
        }
        return this.instance;
    }
    public addUser(spaceId, userId: User){
        if(!this.rooms.has(spaceId)){
        }
    }
}