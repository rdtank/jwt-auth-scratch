import { Router } from "express";
import { login, logout, refresh, register } from "../controllers";
import { loginRateLimiter } from "../middleware";

const authRouter = Router();

// REGISTER
authRouter.post("/register", register);

// LOGIN
authRouter.post("/login", loginRateLimiter, login);

// REFRESH
authRouter.post("/refresh", refresh);

// LOGOUT
authRouter.post("/logout", logout);

export { authRouter };
