"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var mongoose_1 = __importDefault(require("mongoose"));
var AppRouter_1 = __importDefault(require("./AppRouter"));
require("./controllers/TourController");
require("./controllers/UserController");
var errorController_1 = __importDefault(require("./controllers/errorController"));
var AppError_1 = __importDefault(require("./utils/AppError"));
dotenv_1.default.config({ path: __dirname + "/../config.env" });
console.log(AppRouter_1.default.getInstance()["post"]);
var app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use("/api/v1", AppRouter_1.default.getInstance());
app.all("*", function (req, res, next) {
    var err = new AppError_1.default("Can't find this '" + req.originalUrl + "' URL on the server!", 404);
    next(err);
});
app.use(errorController_1.default.globalErrorHandler);
var DB = process.env.DATABASE;
var PORT = process.env.PORT;
mongoose_1.default
    .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(function () {
    console.log("DATABASE Connection Successfull!");
});
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
