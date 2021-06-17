import "reflect-metadata";

export enum RouteMethods {
  get = "get",
  post = "post",
  put = "put",
  patch = "patch",
  delete = "delete",
}

function routeBinder(method: RouteMethods) {
  return function (path: string) {
    return function (target: any, key: string) {
      Reflect.defineMetadata("path", path, target, key);
      Reflect.defineMetadata("method", method, target, key);
    };
  };
}

export const get = routeBinder(RouteMethods.get);
export const post = routeBinder(RouteMethods.post);
export const put = routeBinder(RouteMethods.put);
export const patch = routeBinder(RouteMethods.patch);
export const del = routeBinder(RouteMethods.delete);
