import { Router } from "express";
import { me } from "../controllers";
import { requireAuth } from "../middleware";

const meRouter = Router();

meRouter.get("/me", requireAuth, me);

export { meRouter };
