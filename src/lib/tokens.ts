import "dotenv/config";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "10s" });
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): { userId: string } {
  return jwt.verify(token, ACCESS_SECRET) as { userId: string };
}

export function verifyRefreshToken(token: string): { userId: string } {
  return jwt.verify(token, REFRESH_SECRET) as { userId: string };
}
