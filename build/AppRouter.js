"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AppRouter = /** @class */ (function () {
    function AppRouter() {
    }
    AppRouter.getInstance = function () {
        if (!this.instance) {
            this.instance = express_1.Router();
        }
        return this.instance;
    };
    return AppRouter;
}());
exports.default = AppRouter;
