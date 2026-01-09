import { Request, Response } from "express";
import { users } from "../db/users";
import { NotFoundError } from "../errors/AppError";

export const me = (req: Request, res: Response) => {
  res.json({ user: req.userId });
};

export const getUser = (req: Request, res: Response) => {
  const user = users.find((candidate) => candidate.id === req.params.userId);

  if (!user) {
    throw new NotFoundError("User");
  }

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
};
