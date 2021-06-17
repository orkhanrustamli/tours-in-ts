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
Object.defineProperty(exports, "__esModule", { value: true });
var APIFeature = /** @class */ (function () {
    function APIFeature(query, queryObj) {
        this.query = query;
        this.queryObj = queryObj;
    }
    APIFeature.prototype.filter = function () {
        var filterObj = __assign({}, this.queryObj);
        var excludedFields = ["limit", "page", "sort", "fields"];
        excludedFields.forEach(function (el) { return delete filterObj[el]; });
        var queryStr = JSON.stringify(filterObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$" + match; });
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    };
    APIFeature.prototype.sort = function () {
        if (this.queryObj.sort) {
            var sortQuery = this.queryObj.sort.split(",").join(" ");
            this.query = this.query.sort(sortQuery);
        }
        else {
            this.query = this.query.sort("-createdAt");
        }
        return this;
    };
    // Projection - Field Select
    APIFeature.prototype.selectFields = function () {
        if (this.queryObj.fields) {
            var fields = this.queryObj.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select("-__v");
        }
        return this;
    };
    // Pagination
    APIFeature.prototype.limit = function () {
        if (this.queryObj.limit) {
            var page = this.queryObj.page * 1 || 1;
            var limit = this.queryObj.limit * 1 || 20;
            var skip = (page - 1) * limit;
            this.query = this.query.skip(skip).limit(limit);
        }
        return this;
    };
    return APIFeature;
}());
exports.default = APIFeature;
