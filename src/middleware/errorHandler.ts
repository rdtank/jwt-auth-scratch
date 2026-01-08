import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { logger } from "../lib/logger";

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  req.log?.error({ err: error }, "Unhandled request error");
  logger.error({ err: error }, "Unhandled request error");
  res.status(500).json({ message: "Internal server error" });
};
