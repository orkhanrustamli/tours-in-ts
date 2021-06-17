import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import mongoose from "mongoose";

import AppRouter from "./AppRouter";
import "./controllers/TourController";
import "./controllers/UserController";
import ErrorController from "./controllers/errorController";
import AppError from "./utils/AppError";
import catchAsync from "./utils/catchAsync";
import { tourModel } from "./models/tourModel";

dotenv.config({ path: `${__dirname}/../config.env` });

console.log(AppRouter.getInstance()["post"]);

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", AppRouter.getInstance());

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new AppError(`Can't find this '${req.originalUrl}' URL on the server!`, 404);
  next(err);
});

app.use(ErrorController.globalErrorHandler);

const DB = process.env.DATABASE as string;
const PORT = process.env.PORT;

mongoose
  .connect(DB as string, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DATABASE Connection Successfull!");
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
