import { refreshTokens } from "../db/refreshTokens";
import { users } from "../db/users";
import { AppError, UnauthorizedError } from "../errors/AppError";
import { hashPassword, verifyPassword } from "../lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/tokens";
import { asyncHandler } from "../middleware";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  // Same error for missing user or wrong password (prevents enumeration)
  if (!user || !(await verifyPassword(password, user.password))) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  refreshTokens.set(refreshToken, user.id);

  // Refresh token in httpOnly cookie — JS cannot read it (XSS-safe)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
});

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const existing = users.find((u) => u.email === email);

  if (existing) throw new AppError(409, "Email already registered");

  const passwordHash = await hashPassword(password);

  const user = {
    id: crypto.randomUUID(),
    email,
    password: passwordHash,
    name,
  };

  users.push(user);

  res.status(201).json({ id: user.id, email: user.email });
});

export const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const payload = verifyRefreshToken(oldRefreshToken);

    const exists = refreshTokens.has(oldRefreshToken);

    if (!exists) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    refreshTokens.delete(oldRefreshToken);

    const user = users.find((u) => u.id === payload.userId);

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    refreshTokens.set(newRefreshToken, user.id);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    refreshTokens.delete(token);
  }

  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
});
