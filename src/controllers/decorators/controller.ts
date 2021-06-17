import "reflect-metadata";

import AppRouter from "../../AppRouter";
import { RouteMethods } from "./routeMethods";
import { expressFunction } from "./use";

export function controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();

    for (const key in target.prototype) {
      const routeHandler = target.prototype[key];

      const path: string = Reflect.getMetadata("path", target.prototype, key);
      const method: RouteMethods = Reflect.getMetadata("method", target.prototype, key);
      const middlewares: expressFunction[] = Reflect.getMetadata("mids", target.prototype, key) || [];
      router[method](`${routePrefix}${path}`, ...middlewares, routeHandler());
    }
  };
}
