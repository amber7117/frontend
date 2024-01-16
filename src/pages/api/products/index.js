import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Brands from "models/Brands";
import _ from "lodash";
import mongoose from "mongoose";
export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();
  switch (method) {
    case "GET":
      try {
        // // Run the middleware
        var newQuery = { ...query };
        delete newQuery.page;
        delete newQuery.prices;
        delete newQuery.sizes;
        delete newQuery.colors;
        delete newQuery.name;
        delete newQuery.date;
        delete newQuery.price;
        delete newQuery.top;
        delete newQuery.unit;
        for (const [key, value] of Object.entries(newQuery)) {
          newQuery = { ...newQuery, [key]: value.split("_") };
        }
        const brand = await Brands.findOne({
          slug: query.brand,
        }).select(["_id"]);
        const skip = query.limit || 12;
        const totalProducts = await Products.countDocuments({
          ...newQuery,
          ...(query.brand && { brand: mongoose.Types.ObjectId(brand?._id) }),
          ...(query.sizes && { sizes: { $in: query.sizes.split("_") } }),
          ...(query.colors && { colors: { $in: query.colors.split("_") } }),

          "variants.priceSale": {
            $gt: query.prices ? query.prices.split("_")[0] : 1,
            $lt: query.prices ? query.prices.split("_")[1] : 1000000,
          },
          status: { $ne: "disabled" },
        }).select([""]);

        const minPrice = query.prices
          ? Number(query.prices.split("_")[0]) / Number(query.unit)
          : 1;
        const maxPrice = query.prices
          ? Number(query.prices.split("_")[1]) / Number(query.unit)
          : 10000000;

        const products = await Products.aggregate([
          {
            $lookup: {
              from: "reviews",
              localField: "reviews",
              foreignField: "_id",
              as: "reviews",
            },
          },
          {
            $addFields: {
              averageRating: { $avg: "$reviews.rating" },
            },
          },
          {
            $match: {
              ...(query.subCategory && {
                subCategory: mongoose.Types.ObjectId(query.subCategory),
              }),
              ...(query.category && {
                category: mongoose.Types.ObjectId(query.category),
              }),
              ...(query.gender && {
                gender: { $in: query.gender.split("_") },
              }),
              ...(query.sizes && {
                "variants.size": { $in: query.sizes.split("_") },
              }),
              ...(query.brand && {
                brand: mongoose.Types.ObjectId(brand._id),
              }),
              ...(query.colors && {
                "variants.color": { $in: query.colors.split("_") },
              }),
              ...(query.prices && {
                "variants.priceSale": {
                  $gt: minPrice,
                  $lt: maxPrice,
                },
              }),
              status: { $ne: "disabled" },
            },
          },

          {
            $sort: {
              ...((query.date && { createdAt: Number(query.date) }) ||
                (query.price && {
                  "variants.priceSale": Number(query.price),
                }) ||
                (query.name && { name: Number(query.name) }) ||
                (query.top && { averageRating: Number(query.top) }) || {
                  averageRating: -1,
                }),
            },
          },
          {
            $skip: Number(skip * parseInt(query.page ? query.page[0] - 1 : 0)),
          },
          {
            $limit: Number(skip),
          },
        ]);
        /* find all the data in our database */
        res.status(200).json({
          success: true,
          data: products,
          total: totalProducts,
          count: Math.ceil(totalProducts / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
