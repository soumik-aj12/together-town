import z from "zod"

//User
export const SignupSchema = z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(4).max(255),
    role: z.enum(["user","admin"])
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(255),
    role: z.enum(["user","admin"])
})

export const UpdateAvatarSchema = z.object({
    avatarId: z.string(),
})

export const CreateSpaceSchema = z.object({
    name: z.string().min(3).max(255),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId: z.string().optional()
})

export const AddElementSchema = z.object({
    elementId: z.string(),
    spaceId: z.string(),
    x: z.number(),
    y: z.number()
})

export const DeleteElementSchema = z.object({
    id: z.string(),
})

//Admin
export const CreateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean()
})

export const UpdateElementSchema = z.object({
    imageUrl: z.string(),
    width: z.number(),
    height: z.number(),
    static: z.boolean()
})

export const CreateAvatarSchema = z.object({
    name: z.string(),
    imageUrl: z.string(),
})

export const CreateMapSchema = z.object({
    name: z.string(),
    thumbnail: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId: z.string(),
        x: z.number(),
        y: z.number(),
    }))
})