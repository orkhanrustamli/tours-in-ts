import { Query, Document } from "mongoose";

class APIFeature<T extends Document> {
  constructor(public query: Query<T[], T>, public queryObj: any) {}

  filter() {
    const filterObj = { ...this.queryObj };
    const excludedFields = ["limit", "page", "sort", "fields"];
    excludedFields.forEach((el) => delete filterObj[el]);

    let queryStr = JSON.stringify(filterObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryObj.sort) {
      const sortQuery = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortQuery);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Projection - Field Select
  selectFields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // Pagination
  limit() {
    if (this.queryObj.limit) {
      const page = this.queryObj.page * 1 || 1;
      const limit = this.queryObj.limit * 1 || 20;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export default APIFeature;
