import { Request, Response, NextFunction } from "express";

import { controller } from "./decorators/controller";
import { use, expressFunctionWithUser } from "./decorators/use";
import { del, get, post, patch } from "./decorators/routeMethods";
import { allowedOnly, RequestWithUser, loginRequired } from "./middlewares/authorizator";
import { tourModel, ITourInput, ITourDoc } from "../models/tourModel";
import { IReviewDoc, IReviewModel, reviewModel } from "../models/reviewModel";
import APIFeature from "../utils/APIFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";

@controller("/reviews")
class TourController {
  @del("/:reviewId")
  @use(loginRequired)
  @use(allowedOnly("admin"))
  deleteReview() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const review = await reviewModel.findByIdAndDelete(req.params.reviewId);

      if (!review) return next(new AppError(`No review found with that ID`, 404));

      res.status(200).json({
        status: "success",
        data: null,
      });
    });
  }

  @patch("/:reviewId")
  @use(loginRequired)
  @use(allowedOnly("admin"))
  updateReview() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const review = await reviewModel.findByIdAndUpdate(req.params.reviewId, req.body, {
        new: true,
        runValidators: true,
      });

      if (!review) return next(new AppError(`No review found with that ID`, 404));

      res.status(200).json({
        status: "success",
        data: {
          review,
        },
      });
    });
  }
}
