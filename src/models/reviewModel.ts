import { Document, Model, model, Schema, ObjectId, Query } from "mongoose";
import { ITourDoc, tourModel } from "./tourModel";
import { IUserDoc } from "./userModel";

export interface IReview {
  review: string;
  rating: number;
  createdAt: Date;
  tour: ITourDoc | ObjectId;
  user: IUserDoc | ObjectId;
}

export interface IReviewDoc extends IReview, Document {}

export interface IReviewModel extends Model<IReviewDoc> {
  calcAvgRating: (toudId: ObjectId) => Promise<void>;
}

export interface IReviewQuery extends Query<IReviewDoc, IReviewDoc> {
  review: IReviewDoc;
}

const ReviewSchema: Record<keyof IReview, any> = {
  review: {
    type: String,
    required: [true, "Review cannot be empty!"],
  },
  rating: {
    type: Number,
    require: [true, "Review must have rating!"],
    min: [1, "Rating must be above 1.0"],
    max: [5, "Rating must be below 5.0"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: Schema.Types.ObjectId,
    ref: "Tour",
    required: [true, "Review must belong to a tour"],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user"],
  },
};

const reviewSchema = new Schema<IReviewDoc, IReviewModel, IReviewDoc>(ReviewSchema, { id: false });

reviewSchema.statics.calcAvgRating = async function (tourId: ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  let ratingData = {};
  if (stats.length > 0) {
    ratingData = {
      ratingsAvarage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRatings,
    };
  } else {
    ratingData = {
      ratingsAvarage: 4.5,
      ratingsQuantity: 0,
    };
  }
  await tourModel.findByIdAndUpdate(tourId, ratingData);
};

reviewSchema.post("save", function () {
  (this.constructor as IReviewModel).calcAvgRating(this.tour as ObjectId);
});

reviewSchema.pre<IReviewQuery>(/^findOneAnd/, async function (next) {
  this.review = (await this.findOne()) as IReviewDoc;
});

reviewSchema.post<IReviewQuery>(/^findOneAnd/, async function () {
  await (this.review.constructor as IReviewModel).calcAvgRating((this.review as IReviewDoc).tour as ObjectId);
});

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });

  next();
});

export const reviewModel = model<IReviewDoc, IReviewModel>("Review", reviewSchema);
