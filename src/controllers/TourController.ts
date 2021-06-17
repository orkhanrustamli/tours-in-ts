import { Request, Response, NextFunction } from "express";

import { controller } from "./decorators/controller";
import { use } from "./decorators/use";
import { del, get, post, patch } from "./decorators/routeMethods";
import { tourModel, ITourDoc } from "../models/tourModel";
import { reviewModel } from "../models/reviewModel";
import APIFeature from "../utils/APIFeatures";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { getTopTours } from "./middlewares/topTours";
import { uploadTourImages, resizeTourImages } from "./middlewares/images";
import { loginRequired, RequestWithUser, allowedOnly } from "./middlewares/authorizator";

function getToursHelper() {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeature<ITourDoc>(tourModel.find(), req.query).filter().sort().selectFields().limit();

    const tours: ITourDoc[] = await features.query;

    res.status(200).json({
      status: "success",
      result: tours.length,
      tours,
    });
  });
}

@controller("/tours")
class TourController {
  @get("/top-tours")
  @use(loginRequired)
  @use(getTopTours)
  getTopTours() {
    return getToursHelper();
  }

  @get("/")
  getTours() {
    return getToursHelper();
  }

  @post("/")
  @use(loginRequired)
  @use(allowedOnly("admin"))
  createTour() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const tourData: ITourDoc = await tourModel.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          tour: tourData,
        },
      });
    });
  }

  @get("/get-tour-stats")
  @use(loginRequired)
  getTourStats() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const stats = await tourModel.aggregate([
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
      ]);

      res.status(200).json({
        status: "success",
        data: {
          stats,
        },
      });
    });
  }

  @get("/get-monthly-plan/:year")
  @use(loginRequired)
  getMongthlyPlan() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const year: number = +req.params.year;
      const monthNames: string[] = [
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
      const stats = await tourModel.aggregate([
        {
          $unwind: "$startDates",
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
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
      ]);
      res.status(200).json({
        status: "success",
        data: {
          stats,
        },
      });
    });
  }

  @get("/:id")
  getTour() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const tour: ITourDoc | null = await tourModel.findById(req.params.id);

      if (!tour) res.status(400).json({ status: "fail", message: "Not a tour with this id" });

      res.status(200).json({ status: "success", data: { tour } });
    });
  }

  @patch("/:id")
  @use(loginRequired)
  @use(allowedOnly("admin"))
  @use(uploadTourImages)
  @use(resizeTourImages)
  updateTour() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const tour = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!tour) return next(new AppError(`No tour found with that ID`, 404));

      res.status(200).json({
        status: "success",
        data: {
          tour,
        },
      });
    });
  }

  @del("/:id")
  @use(allowedOnly("admin"))
  deleteTour() {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const tour = await tourModel.findByIdAndDelete(req.params.id);

      if (!tour) return next(new AppError(`No tour found with that ID`, 404));

      res.status(200).json({
        status: "success",
        data: null,
      });
    });
  }

  @post("/:id/review")
  @use(loginRequired)
  reviewTour() {
    return catchAsync(async (req: RequestWithUser, res: Response, next: NextFunction) => {
      const reviewData = { ...req.body, tour: req.params.id, user: req.user._id };
      const review = await reviewModel.create(reviewData);

      res.status(201).json({
        status: "success",
        data: {
          review,
        },
      });
    });
  }
}
