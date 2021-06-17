import { Request, Response, NextFunction } from "express";

export default function catchAsync(func: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    func(req, res, next).catch(next);
  };
}
``;
