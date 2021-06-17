"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRequired = exports.allowedOnly = void 0;
var AppError_1 = __importDefault(require("../../utils/AppError"));
var catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
var util_1 = require("util");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userModel_1 = require("../../models/userModel");
var allowedOnly = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            return next(new AppError_1.default("You do not have permission to perform this action!", 403));
        }
        next();
    };
};
exports.allowedOnly = allowedOnly;
exports.loginRequired = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, prom, payload, fetchedUser;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("JWT")) {
                    token = req.headers.authorization.split(" ")[1];
                }
                if (!token)
                    return [2 /*return*/, next(new AppError_1.default("Login is required before accessing the resource!", 401))];
                prom = util_1.promisify(jsonwebtoken_1.default.verify);
                payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                return [4 /*yield*/, userModel_1.userModel.findById(payload.id)];
            case 1:
                fetchedUser = _b.sent();
                if (!fetchedUser) {
                    return [2 /*return*/, next(new AppError_1.default("User does no longer exists.", 401))];
                }
                // 4. Check whether password was changed
                if (fetchedUser.passwordChangedAfter(payload.iat)) {
                    return [2 /*return*/, next(new AppError_1.default("Password was changed recently. Please login again!", 401))];
                }
                req.user = fetchedUser;
                next();
                return [2 /*return*/];
        }
    });
}); });
