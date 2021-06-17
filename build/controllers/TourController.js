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
var controller_1 = require("./decorators/controller");
var use_1 = require("./decorators/use");
var routeMethods_1 = require("./decorators/routeMethods");
var tourModel_1 = require("../models/tourModel");
var reviewModel_1 = require("../models/reviewModel");
var APIFeatures_1 = __importDefault(require("../utils/APIFeatures"));
var catchAsync_1 = __importDefault(require("../utils/catchAsync"));
var AppError_1 = __importDefault(require("../utils/AppError"));
var topTours_1 = require("./middlewares/topTours");
var images_1 = require("./middlewares/images");
var authorizator_1 = require("./middlewares/authorizator");
function getToursHelper() {
    var _this = this;
    return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var features, tours;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    features = new APIFeatures_1.default(tourModel_1.tourModel.find(), req.query).filter().sort().selectFields().limit();
                    return [4 /*yield*/, features.query];
                case 1:
                    tours = _a.sent();
                    res.status(200).json({
                        status: "success",
                        result: tours.length,
                        tours: tours,
                    });
                    return [2 /*return*/];
            }
        });
    }); });
}
var TourController = /** @class */ (function () {
    function TourController() {
    }
    TourController.prototype.getTopTours = function () {
        return getToursHelper();
    };
    TourController.prototype.getTours = function () {
        return getToursHelper();
    };
    TourController.prototype.createTour = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tourData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tourModel_1.tourModel.create(req.body)];
                    case 1:
                        tourData = _a.sent();
                        res.status(201).json({
                            status: "success",
                            data: {
                                tour: tourData,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.getTourStats = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tourModel_1.tourModel.aggregate([
                            {
                                $match: { ratingsAvarage: { $gte: 4.5 } },
                            },
                            {
                                $group: {
                                    _id: { $toUpper: "$difficulty" },
                                    toursNum: { $sum: 1 },
                                    ratingsNum: { $sum: "$ratingsQuantity" },
                                    ratingsAvg: { $avg: "$ratingsAvarage" },
                                    priceAvg: { $avg: "$price" },
                                    priceMin: { $min: "$price" },
                                    pricemax: { $max: "$price" },
                                },
                            },
                        ])];
                    case 1:
                        stats = _a.sent();
                        res.status(200).json({
                            status: "success",
                            data: {
                                stats: stats,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.getMongthlyPlan = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var year, monthNames, stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        year = +req.params.year;
                        monthNames = [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                        ];
                        return [4 /*yield*/, tourModel_1.tourModel.aggregate([
                                {
                                    $unwind: "$startDates",
                                },
                                {
                                    $match: {
                                        startDates: {
                                            $gte: new Date(year + "-01-01"),
                                            $lte: new Date(year + "-12-31"),
                                        },
                                    },
                                },
                                {
                                    $group: {
                                        _id: { $month: "$startDates" },
                                        toursNum: { $sum: 1 },
                                        tours: { $push: "$name" },
                                    },
                                },
                                {
                                    $addFields: {
                                        month: { $arrayElemAt: [monthNames, { $subtract: ["$_id", 1] }] },
                                    },
                                },
                                {
                                    $sort: {
                                        _id: 1,
                                    },
                                },
                                {
                                    $project: {
                                        _id: 0,
                                    },
                                },
                            ])];
                    case 1:
                        stats = _a.sent();
                        res.status(200).json({
                            status: "success",
                            data: {
                                stats: stats,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.getTour = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tour;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tourModel_1.tourModel.findById(req.params.id)];
                    case 1:
                        tour = _a.sent();
                        if (!tour)
                            res.status(400).json({ status: "fail", message: "Not a tour with this id" });
                        res.status(200).json({ status: "success", data: { tour: tour } });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.updateTour = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tour;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tourModel_1.tourModel.findByIdAndUpdate(req.params.id, req.body, {
                            new: true,
                            runValidators: true,
                        })];
                    case 1:
                        tour = _a.sent();
                        if (!tour)
                            return [2 /*return*/, next(new AppError_1.default("No tour found with that ID", 404))];
                        res.status(200).json({
                            status: "success",
                            data: {
                                tour: tour,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.deleteTour = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var tour;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, tourModel_1.tourModel.findByIdAndDelete(req.params.id)];
                    case 1:
                        tour = _a.sent();
                        if (!tour)
                            return [2 /*return*/, next(new AppError_1.default("No tour found with that ID", 404))];
                        res.status(200).json({
                            status: "success",
                            data: null,
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TourController.prototype.reviewTour = function () {
        var _this = this;
        return catchAsync_1.default(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var reviewData, review;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reviewData = __assign(__assign({}, req.body), { tour: req.params.id, user: req.user._id });
                        return [4 /*yield*/, reviewModel_1.reviewModel.create(reviewData)];
                    case 1:
                        review = _a.sent();
                        res.status(201).json({
                            status: "success",
                            data: {
                                review: review,
                            },
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    __decorate([
        routeMethods_1.get("/top-tours"),
        use_1.use(authorizator_1.loginRequired),
        use_1.use(topTours_1.getTopTours),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "getTopTours", null);
    __decorate([
        routeMethods_1.get("/"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "getTours", null);
    __decorate([
        routeMethods_1.post("/"),
        use_1.use(authorizator_1.loginRequired),
        use_1.use(authorizator_1.allowedOnly("admin")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "createTour", null);
    __decorate([
        routeMethods_1.get("/get-tour-stats"),
        use_1.use(authorizator_1.loginRequired),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "getTourStats", null);
    __decorate([
        routeMethods_1.get("/get-monthly-plan/:year"),
        use_1.use(authorizator_1.loginRequired),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "getMongthlyPlan", null);
    __decorate([
        routeMethods_1.get("/:id"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "getTour", null);
    __decorate([
        routeMethods_1.patch("/:id"),
        use_1.use(authorizator_1.loginRequired),
        use_1.use(authorizator_1.allowedOnly("admin")),
        use_1.use(images_1.uploadTourImages),
        use_1.use(images_1.resizeTourImages),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "updateTour", null);
    __decorate([
        routeMethods_1.del("/:id"),
        use_1.use(authorizator_1.allowedOnly("admin")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "deleteTour", null);
    __decorate([
        routeMethods_1.post("/:id/review"),
        use_1.use(authorizator_1.loginRequired),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TourController.prototype, "reviewTour", null);
    TourController = __decorate([
        controller_1.controller("/tours")
    ], TourController);
    return TourController;
}());
