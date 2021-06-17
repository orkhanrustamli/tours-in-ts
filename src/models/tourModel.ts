import slugify from "slugify";
import { model, Schema, Types, Document, Query, Aggregate } from "mongoose";
import { IUser, IUserDoc } from "./userModel";

enum Difficulty {
  easy = "easy",
  medium = "medium",
  difficult = "difficult",
}

type BaseLocation = { type: "Point"; description: string; coordinates: [number, number] };
type StartLocation = BaseLocation & { address: string };
type Location = { day: number } & BaseLocation;

type ID = Types.ObjectId;

export interface ITourInput {
  name: string;
  price: number;
  priceDiscount?: number;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  summary: string;
  description?: string;
  imageCover: string;
  images?: string[];
  startLocation?: StartLocation;
  locations?: Location[];
  guides?: string[];
  startDates?: Date[];
  secret?: boolean;
}

export interface ITour extends ITourInput {
  slug: string;
  ratingsAvarage: number;
  ratingsQuantity: number;
  createdAt: Date;
}

export interface ITourDoc extends ITour, Document {}

const TourSchemaFields: Record<keyof ITour, any> = {
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
    set: (val: number): number => Math.round(val * 10) / 10,
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
  guides: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

const tourSchema = new Schema(TourSchemaFields);

tourSchema.pre<ITourDoc>("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre<Query<ITourDoc, ITourDoc>>(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.pre<Aggregate<ITourDoc>>("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});

export const tourModel = model<ITourDoc>("Tour", tourSchema);
