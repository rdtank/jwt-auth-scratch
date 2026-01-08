import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { createHttpLogger } from "./lib/logger";
import { corsMiddleware, errorHandler } from "./middleware";
import { authRouter, meRouter } from "./routes";

export function createApp(httpLogger = createHttpLogger()) {
  const app = express();

  app.use(httpLogger);
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(cookieParser());

  app.use("/auth", authRouter);
  app.use("/user", meRouter);

  app.use(errorHandler);

  return app;
}
