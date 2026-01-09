import { Router } from "express";
import { getUser, me } from "../controllers";
import { requireAuth, requireOwnership } from "../middleware";

const meRouter = Router();

meRouter.get("/me", requireAuth, me);
meRouter.get("/:userId", requireAuth, requireOwnership, getUser);

export { meRouter };
