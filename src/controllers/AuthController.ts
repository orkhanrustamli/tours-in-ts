import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import { userModel, IUserDoc } from "../models/userModel";
import { controller, post, patch, use } from "./decorators/index";
import { loginRequired, RequestWithUser } from "./middlewares/authorizator";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import createAndSendToken from "../utils/createAndSendToken";
import sendEmail from "../utils/sendEmail";

@controller("/auth")
class AuthController {
  @post("/signup")
  signUp() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const newUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });

      createAndSendToken(newUser, 201, res);
    });
  }

  @post("/login")
  login() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new AppError("Email or Password is missing", 400));
      }

      const user = await userModel.findOne({ email: email }).select("+password");
      if (!user || !(await user.checkPassword(password))) {
        return next(new AppError("Email or Password is incorrect", 401));
      }

      createAndSendToken(user, 201, res);
    });
  }

  @post("/forgot-password")
  forgotPassword() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      if (!req.body.email) return next(new AppError("Please provide email address", 400));

      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return next(new AppError("There is no user with this email address", 404));
      }

      const resetToken: string = user.createPasswordResetToken();
      await user.save({ validateBeforeSave: false });

      const resetURL: string = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`;
      const message: string = `Please click on: ${resetURL} to reset your password`;

      try {
        await sendEmail({
          reciever: user.email,
          subject: "Password Reset (valid for 10 mins)",
          message: message,
        });

        res.json({
          status: "success",
          message: "Token sent to mail",
        });
      } catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        next(new AppError("The was an error while sending the mail. Try again later!", 500));
      }
    });
  }

  @post("/reset-password/:resetToken")
  resetPassword() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const hashedResetToken: string = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

      const user = await userModel.findOne({
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpires: { $gt: new Date(Date.now()) },
      });

      if (!user) {
        return next(new AppError("Token is invalid or has expired", 400));
      }

      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();

      createAndSendToken(user, 201, res);
    });
  }

  @patch("/change-password")
  @use(loginRequired)
  changePassword() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      if (!req.body.passwordCurrent || !req.body.password || !req.body.passwordConfirm) {
        return next(new AppError("Please fill all the required fields!", 400));
      }

      const user = await userModel.findById(req.user._id).select("+password");
      if (!user) return next(new AppError("Something went wrong. Cannot find user in database with current logged user data", 400));

      if (!(await user.checkPassword(req.body.passwordCurrent))) return next(new AppError("Current password is incorrect!", 400));

      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();

      createAndSendToken(user, 201, res);
    });
  }
}
