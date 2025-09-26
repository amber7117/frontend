import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import BlogCategories from "models/BlogCategories";
import runMiddleware from "lib/cors";
import Cors from "cors";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const categories = await BlogCategories.find({}, null, {
          limit: 1,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: categories });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const category = await BlogCategories.create({
          ...req.body,
        }); /* find all the data in our database */

        res.status(200).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
