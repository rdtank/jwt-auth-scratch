import { NextFunction } from "express";
import { UnauthorizedError } from "../errors/AppError";
import { verifyAccessToken } from "../lib/tokens";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }
  const token = header.split(" ")[1];

  try {
    const { userId } = verifyAccessToken(token);
    req.userId = userId;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
