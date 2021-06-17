"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopTours = void 0;
function getTopTours(req, res, next) {
    req.query.sort = "ratingsAvarage,price";
    req.query.fields = "name,price,summary,ratingsAvarage,difficulty";
    req.query.limit = "5";
    next();
}
exports.getTopTours = getTopTours;
