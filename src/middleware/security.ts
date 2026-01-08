import cors from "cors";
import { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { ForbiddenError } from "../errors/AppError";

const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const corsMiddleware = cors({
  origin: clientOrigin,
  credentials: true,
});

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many login attempts. Try again later." },
});

export function requireOwnership(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.params.userId !== req.userId) {
    throw new ForbiddenError("You cannot access another user's data");
  }

  next();
}
