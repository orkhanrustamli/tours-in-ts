"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var AppError_1 = __importDefault(require("../utils/AppError"));
var ErrorController = /** @class */ (function () {
    function ErrorController() {
    }
    ErrorController.handleCastError = function (error) {
        var message = "Invalid " + error.path + ": " + error.value;
        return new AppError_1.default(message, 400);
    };
    ErrorController.handleDuplicateKey = function (error) {
        var message = "Duplicate key error!";
        if (error.keyPattern.name)
            message = "Duplicate key value at property 'name': '" + error.keyValue.name + "'";
        if (error.keyPattern.email)
            message = "Duplicate key value at property 'email': '" + error.keyValue.email + "'";
        return new AppError_1.default(message, 400);
    };
    ErrorController.handleValidationError = function (error) {
        var messages = Object.values(error.errors).map(function (el) { return el.message; });
        var message = "Invalid input data: " + messages.join(" ");
        return new AppError_1.default(message, 400);
    };
    ErrorController.handleInvalidTokenError = function () {
        var message = "Invalid token. Please login again.";
        return new AppError_1.default(message, 401);
    };
    ErrorController.handleTokenExpireError = function () {
        var message = "Session timed out. Please login again.";
        return new AppError_1.default(message, 401);
    };
    ErrorController.sendError = function (err, res) {
        if (err.isOperational) {
            console.log(err);
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        else {
            console.log(err);
            res.status(500).json({
                status: "error",
                message: "Something went wrong!",
            });
        }
    };
    ErrorController.globalErrorHandler = function (err, req, res, next) {
        err.statusCode = err.statusCode || 500;
        err.status = err.status || "error";
        var error = __assign(__assign({}, err), { name: err.name, message: err.message });
        if (error.name === "CastError")
            error = ErrorController.handleCastError(error);
        if (error.code === 11000)
            error = ErrorController.handleDuplicateKey(error);
        if (error.name === "ValidationError")
            error = ErrorController.handleValidationError(error);
        if (error.name === "JsonWebTokenError")
            error = ErrorController.handleInvalidTokenError();
        if (error.name === "TokenExpiredError")
            error = ErrorController.handleTokenExpireError();
        ErrorController.sendError(error, res);
    };
    return ErrorController;
}());
exports.default = ErrorController;
