"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tourModel = void 0;
var slugify_1 = __importDefault(require("slugify"));
var mongoose_1 = require("mongoose");
var Difficulty;
(function (Difficulty) {
    Difficulty["easy"] = "easy";
    Difficulty["medium"] = "medium";
    Difficulty["difficult"] = "difficult";
})(Difficulty || (Difficulty = {}));
var TourSchemaFields = {
    name: {
        type: String,
        required: [true, "Name of the tour is missing!"],
        unique: [true, "Name already exists!"],
        trim: true,
        maxLength: [40, "Tour name must have no more than 40 letters"],
        minlength: [10, "Tour name must have no less than 10 letters"],
    },
    slug: String,
    price: {
        type: Number,
        required: [true, "Price of the tour is missing!"],
    },
    priceDiscount: Number,
    duration: {
        type: Number,
        required: [true, "Duration of the tour is missing!"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "Maximum group size of the tour is missing!"],
    },
    difficulty: {
        type: String,
        required: [true, "Difficulty of the tour is missing!"],
        trim: true,
        enum: {
            values: ["easy", "medium", "difficult"],
            message: 'Difficult must be one of these: "easy", "medium" or "difficult"',
        },
    },
    ratingsAvarage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: function (val) { return Math.round(val * 10) / 10; },
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "Summary of the tour is missing!"],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, "Summary of the tour is missing!"],
    },
    images: [String],
    startLocation: {
        // GeoJSON Object Format
        type: {
            type: String,
            default: "Point",
            enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
            _id: false,
        },
    ],
    guides: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    secret: {
        type: Boolean,
        default: false,
    },
};
var tourSchema = new mongoose_1.Schema(TourSchemaFields);
tourSchema.pre("save", function (next) {
    this.slug = slugify_1.default(this.name, { lower: true });
    next();
});
tourSchema.pre(/^find/, function (next) {
    this.find({ secret: { $ne: true } });
    next();
});
tourSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { secret: { $ne: true } } });
    next();
});
exports.tourModel = mongoose_1.model("Tour", tourSchema);
