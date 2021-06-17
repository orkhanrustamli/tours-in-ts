import { Request, Response, NextFunction } from "express";
import multer, { StorageEngine, FileFilterCallback } from "multer";
import AppError from "../../utils/AppError";
import catchAsync from "../../utils/catchAsync";
import sharp from "sharp";

const multerStorage: StorageEngine = multer.memoryStorage();

const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! Please upload only images", 400));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

export const resizeTourImages = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files.imageCover || !files.images) return next();

  // 1) Cover Image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Tour Images
  req.body.images = [];

  await Promise.all(
    files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer).resize(2000, 1333).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/img/tours/${req.body.imageCover}`);

      req.body.images.push(filename);
    })
  );

  next();
});
