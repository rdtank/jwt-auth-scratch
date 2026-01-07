import { Router } from "express";
import { login, logout, refresh, register } from "../controllers";

const authRouter = Router();

// REGISTER
authRouter.post("/register", register);

// LOGIN
authRouter.post("/login", login);

// REFRESH
authRouter.post("/refresh", refresh);

// LOGOUT
authRouter.post("/logout", logout);

export { authRouter };
