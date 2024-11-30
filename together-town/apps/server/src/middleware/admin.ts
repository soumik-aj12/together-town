import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      role: "Admin" | "User";
      userId: string;
    }
  }
}

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  const token = header?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: true, message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_HASH!) as {
      role: string;
      userId: string;
    };
    req.userId = decoded.userId;
    next();

    if (decoded.role !== "Admin") {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    }
  } catch (error) {
    res.status(401).json({ error: true, message: "Server Error" });
  }
};
