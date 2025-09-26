import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Categories from "models/Categories";
import Brands from "models/Brands";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    body: { query },
  } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const categories = await Categories.find(
          {
            name: {
              $regex: query,
              $options: "i",
            },
            status: { $ne: "disabled" },
          },
          null,
          { limit: 10 }
        ).select(["name", "cover", "_id", "slug"]);
        const products = await Products.find(
          {
            name: {
              $regex: query,
              $options: "i",
            },
            status: { $ne: "disabled" },
          },
          null,
          { limit: 10 }
        )
          .populate("category")
          .select(["name", "priceSale", "cover", "_id", "category", "slug"]);

        const brands = await Brands.find(
          {
            name: {
              $regex: query,
              $options: "i",
            },
            status: { $ne: "disabled" },
          },
          null,
          { limit: 10 }
        ).select(["name", "logo", "_id", "slug"]);
        res.status(200).json({
          success: true,
          products,
          categories,
          brands,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "GET":
      res.status(400).json({ success: false });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
