import { Response, CookieOptions } from "express";

import jwtSign from "./jwtSign";
import { IUserDoc } from "../models/userModel";

export default async function (user: IUserDoc, statusCode: number, res: Response) {
  const token: string = await jwtSign(user._id);

  const cookieOptions: CookieOptions = {
    expires: new Date(Date.now() + +process.env.JWT_COOKIE_EXPIRE! * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}
