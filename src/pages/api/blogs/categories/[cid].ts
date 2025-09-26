import type { NextApiRequest, NextApiResponse } from "next";
// import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import BlogCategories from "models/BlogCategories";
import { singleFileDelete } from "src/utils/uploader";
// Initializing the cors middleware

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { cid },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const category = await BlogCategories.findOne({
          _id: cid,
        });
        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "Item could not found" });
        }
        res.status(200).json({
          success: true,
          data: category,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "Category could not find." });
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        const category = await BlogCategories.findOne({ _id: cid });
        await singleFileDelete(category.cover._id);
        await BlogCategories.deleteOne({ _id: cid });
        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT" /* Edit a model by its ID */:
      try {
        await BlogCategories.findByIdAndUpdate(
          cid,
          {
            ...req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
