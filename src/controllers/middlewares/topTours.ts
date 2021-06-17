import { Request, Response, NextFunction } from "express";

export function getTopTours(req: Request, res: Response, next: NextFunction) {
  req.query.sort = "ratingsAvarage,price";
  req.query.fields = "name,price,summary,ratingsAvarage,difficulty";
  req.query.limit = "5";
  next();
}
