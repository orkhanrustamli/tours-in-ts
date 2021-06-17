import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export default class ErrorController {
  private static handleCastError(error: any) {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
  }

  private static handleDuplicateKey(error: any): AppError {
    let message: string = "Duplicate key error!";

    if (error.keyPattern.name) message = `Duplicate key value at property 'name': '${error.keyValue.name}'`;
    if (error.keyPattern.email) message = `Duplicate key value at property 'email': '${error.keyValue.email}'`;
    return new AppError(message, 400);
  }

  private static handleValidationError(error: any) {
    const messages = Object.values(error.errors).map((el: any) => el.message);
    const message = `Invalid input data: ${messages.join(" ")}`;
    return new AppError(message, 400);
  }

  private static handleInvalidTokenError() {
    const message = `Invalid token. Please login again.`;
    return new AppError(message, 401);
  }

  private static handleTokenExpireError() {
    const message = `Session timed out. Please login again.`;
    return new AppError(message, 401);
  }

  private static sendError = (err: any, res: Response) => {
    if (err.isOperational) {
      console.log(err);
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong!",
      });
    }
  };

  public static globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    let error = { ...err, name: err.name, message: err.message };

    if (error.name === "CastError") error = ErrorController.handleCastError(error);
    if (error.code === 11000) error = ErrorController.handleDuplicateKey(error);
    if (error.name === "ValidationError") error = ErrorController.handleValidationError(error);
    if (error.name === "JsonWebTokenError") error = ErrorController.handleInvalidTokenError();
    if (error.name === "TokenExpiredError") error = ErrorController.handleTokenExpireError();

    ErrorController.sendError(error, res);
  };
}
