"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.patch = exports.put = exports.post = exports.get = exports.RouteMethods = void 0;
require("reflect-metadata");
var RouteMethods;
(function (RouteMethods) {
    RouteMethods["get"] = "get";
    RouteMethods["post"] = "post";
    RouteMethods["put"] = "put";
    RouteMethods["patch"] = "patch";
    RouteMethods["delete"] = "delete";
})(RouteMethods = exports.RouteMethods || (exports.RouteMethods = {}));
function routeBinder(method) {
    return function (path) {
        return function (target, key) {
            Reflect.defineMetadata("path", path, target, key);
            Reflect.defineMetadata("method", method, target, key);
        };
    };
}
exports.get = routeBinder(RouteMethods.get);
exports.post = routeBinder(RouteMethods.post);
exports.put = routeBinder(RouteMethods.put);
exports.patch = routeBinder(RouteMethods.patch);
exports.del = routeBinder(RouteMethods.delete);
