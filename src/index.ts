import cookieParser from "cookie-parser";
import express from "express";
import { authRouter, meRouter } from "./routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/user", meRouter);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
