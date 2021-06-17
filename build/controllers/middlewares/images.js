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
exports.resizeTourImages = exports.uploadTourImages = void 0;
var multer_1 = __importDefault(require("multer"));
var AppError_1 = __importDefault(require("../../utils/AppError"));
var catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
var sharp_1 = __importDefault(require("sharp"));
var multerStorage = multer_1.default.memoryStorage();
var multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image"))
        cb(null, true);
    else
        cb(new AppError_1.default("Not an image! Please upload only images", 400));
};
var upload = multer_1.default({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadTourImages = upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 },
]);
exports.resizeTourImages = catchAsync_1.default(function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                files = req.files;
                if (!files.imageCover || !files.images)
                    return [2 /*return*/, next()];
                // 1) Cover Image
                req.body.imageCover = "tour-" + req.params.id + "-" + Date.now() + "-cover.jpeg";
                return [4 /*yield*/, sharp_1.default(req.file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({ quality: 90 }).toFile("public/img/tours/" + req.body.imageCover)];
            case 1:
                _a.sent();
                // 2) Tour Images
                req.body.images = [];
                return [4 /*yield*/, Promise.all(files.images.map(function (file, i) { return __awaiter(void 0, void 0, void 0, function () {
                        var filename;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    filename = "tour-" + req.params.id + "-" + Date.now() + "-" + (i + 1) + ".jpeg";
                                    return [4 /*yield*/, sharp_1.default(file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({ quality: 90 }).toFile("public/img/tours/" + req.body.imageCover)];
                                case 1:
                                    _a.sent();
                                    req.body.images.push(filename);
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                next();
                return [2 /*return*/];
        }
    });
}); });
