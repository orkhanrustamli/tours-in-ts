import "reflect-metadata";
import { Request, Response, NextFunction } from "express";

import { RequestWithUser } from "../middlewares/authorizator";

export type expressFunction = (req: Request, res: Response, next: NextFunction) => void | never;
export type expressFunctionWithUser = (req: RequestWithUser, res: Response, next: NextFunction) => void | never;

export function use(middleware: expressFunction | expressFunctionWithUser) {
  return function (target: any, key: string) {
    const registeredMids: Array<expressFunction | expressFunctionWithUser> = Reflect.getMetadata("mids", target, key) || [];

    const newMidsList: Array<expressFunction | expressFunctionWithUser> = [...registeredMids, middleware];

    Reflect.defineMetadata("mids", newMidsList, target, key);
  };
}
