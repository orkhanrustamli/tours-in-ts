import { Request, Response, NextFunction } from "express";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import { promisify } from "util";
import jwt from "jsonwebtoken";

import { IUserDoc, userModel } from "../../models/userModel";

export interface RequestWithUser extends Request {
  user: IUserDoc;
}

export const allowedOnly = (...roles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action!", 403));
    }
    next();
  };
};

export const loginRequired = catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
  // 1. Get the token
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("JWT")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("Login is required before accessing the resource!", 401));

  // 2. Verify the token
  const prom = promisify(jwt.verify);
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string; iat: number };

  // 3. Check user exists
  const fetchedUser = await userModel.findById(payload.id);
  if (!fetchedUser) {
    return next(new AppError("User does no longer exists.", 401));
  }

  // 4. Check whether password was changed
  if (fetchedUser.passwordChangedAfter(payload.iat)) {
    return next(new AppError("Password was changed recently. Please login again!", 401));
  }

  req.user = fetchedUser;
  next();
});
