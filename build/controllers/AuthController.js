"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
var crypto_1 = __importDefault(require("crypto"));
var userModel_1 = require("../models/userModel");
var index_1 = require("./decorators/index");
var authorizator_1 = require("./middlewares/authorizator");
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var createAndSendToken_1 = __importDefault(require("../utils/createAndSendToken"));
var sendEmail_1 = __importDefault(require("../utils/sendEmail"));
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.signUp = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, userModel_1.userModel.create({
                            name: req.body.name,
                            email: req.body.email,
                            photo: req.body.photo,
                            password: req.body.password,
                            passwordConfirm: req.body.passwordConfirm,
                        })];
                    case 1:
                        newUser = _a.sent();
                        createAndSendToken_1.default(newUser, 201, res);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AuthController.prototype.login = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, password, user, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        if (!email || !password) {
                            return [2 /*return*/, next(new AppError_1.default("Email or Password is missing", 400))];
                        }
                        return [4 /*yield*/, userModel_1.userModel.findOne({ email: email }).select("+password")];
                    case 1:
                        user = _c.sent();
                        _b = !user;
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.checkPassword(password)];
                    case 2:
                        _b = !(_c.sent());
                        _c.label = 3;
                    case 3:
                        if (_b) {
                            return [2 /*return*/, next(new AppError_1.default("Email or Password is incorrect", 401))];
                        }
                        createAndSendToken_1.default(user, 201, res);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AuthController.prototype.forgotPassword = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user, resetToken, resetURL, message, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.body.email)
                            return [2 /*return*/, next(new AppError_1.default("Please provide email address", 400))];
                        return [4 /*yield*/, userModel_1.userModel.findOne({ email: req.body.email })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, next(new AppError_1.default("There is no user with this email address", 404))];
                        }
                        resetToken = user.createPasswordResetToken();
                        return [4 /*yield*/, user.save({ validateBeforeSave: false })];
                    case 2:
                        _a.sent();
                        resetURL = req.protocol + "://" + req.get("host") + "/api/v1/auth/reset-password/" + resetToken;
                        message = "Please click on: " + resetURL + " to reset your password";
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 7]);
                        return [4 /*yield*/, sendEmail_1.default({
                                reciever: user.email,
                                subject: "Password Reset (valid for 10 mins)",
                                message: message,
                            })];
                    case 4:
                        _a.sent();
                        res.json({
                            status: "success",
                            message: "Token sent to mail",
                        });
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _a.sent();
                        console.log(error_1);
                        user.passwordResetToken = undefined;
                        user.passwordResetTokenExpires = undefined;
                        return [4 /*yield*/, user.save({ validateBeforeSave: false })];
                    case 6:
                        _a.sent();
                        next(new AppError_1.default("The was an error while sending the mail. Try again later!", 500));
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthController.prototype.resetPassword = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var hashedResetToken, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hashedResetToken = crypto_1.default.createHash("sha256").update(req.params.resetToken).digest("hex");
                        return [4 /*yield*/, userModel_1.userModel.findOne({
                                passwordResetToken: hashedResetToken,
                                passwordResetTokenExpires: { $gt: new Date(Date.now()) },
                            })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, next(new AppError_1.default("Token is invalid or has expired", 400))];
                        }
                        user.password = req.body.password;
                        user.passwordConfirm = req.body.passwordConfirm;
                        user.passwordResetToken = undefined;
                        user.passwordResetTokenExpires = undefined;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _a.sent();
                        createAndSendToken_1.default(user, 201, res);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    AuthController.prototype.changePassword = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.body.passwordCurrent || !req.body.password || !req.body.passwordConfirm) {
                            return [2 /*return*/, next(new AppError_1.default("Please fill all the required fields!", 400))];
                        }
                        return [4 /*yield*/, userModel_1.userModel.findById(req.user._id).select("+password")];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, next(new AppError_1.default("Something went wrong. Cannot find user in database with current logged user data", 400))];
                        return [4 /*yield*/, user.checkPassword(req.body.passwordCurrent)];
                    case 2:
                        if (!(_a.sent()))
                            return [2 /*return*/, next(new AppError_1.default("Current password is incorrect!", 400))];
                        user.password = req.body.password;
                        user.passwordConfirm = req.body.passwordConfirm;
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        createAndSendToken_1.default(user, 201, res);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    __decorate([
        index_1.post("/signup"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "signUp", null);
    __decorate([
        index_1.post("/login"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "login", null);
    __decorate([
        index_1.post("/forgot-password"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "forgotPassword", null);
    __decorate([
        index_1.post("/reset-password/:resetToken"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "resetPassword", null);
    __decorate([
        index_1.patch("/change-password"),
        index_1.use(authorizator_1.loginRequired),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AuthController.prototype, "changePassword", null);
    AuthController = __decorate([
        index_1.controller("/auth")
    ], AuthController);
    return AuthController;
}());
