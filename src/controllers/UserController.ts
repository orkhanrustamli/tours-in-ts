import { Request, Response, NextFunction } from "express";

import { IUserDoc, userModel } from "../models/userModel";
import { use, patch, get, del, controller } from "./decorators/index";
import { RequestWithUser, loginRequired } from "./middlewares/authorizator";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

const _filterObj = (obj: any, ...allowedKeys: string[]): any => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (allowedKeys.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

@controller("/user")
class UserController {
  @patch("/update-me")
  @use(loginRequired)
  updateMe() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError("The payload cannot have password property!", 400));
      }

      const data = _filterObj(req.body, "name", "email");
      if (req.file) data.photo = req.file.filename;

      const user = await userModel.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
      });

      if (!user) return next(new AppError("Something went wrong. Cannot find a user with currently logged user in database.", 400));

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    });
  }

  @del("/delete-me")
  @use(loginRequired)
  deleteMe() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const user = await userModel.findByIdAndUpdate(req.user._id, { active: false });
      if (!user) return next(new AppError("Something went wrong. Cannot find a user with currently logged user in database.", 400));

      res.status(204).json({
        status: "success",
        data: null,
      });
    });
  }

  @get("/get-me")
  @use(loginRequired)
  getMe() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const me = await userModel.findById(req.user._id);
      if (!me) return next(new AppError("Something went wrong. Cannot find a user with currently logged user in database.", 400));

      res.status(200).json({
        status: "success",
        data: {
          me,
        },
      });
    });
  }
}
