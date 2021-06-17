"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = void 0;
require("reflect-metadata");
function use(middleware) {
    return function (target, key) {
        var registeredMids = Reflect.getMetadata("mids", target, key) || [];
        var newMidsList = __spreadArray(__spreadArray([], registeredMids), [middleware]);
        Reflect.defineMetadata("mids", newMidsList, target, key);
    };
}
exports.use = use;
