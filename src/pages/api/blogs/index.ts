import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Blogs from "models/Blogs";
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
  const { method, query } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        delete newQuery.page;
        const skip: any = query.limit || 12;
        const page: any = req.query.page;

        const totalBlogs = await Blogs.countDocuments({});
        const blogs = await Blogs.find({}, null, {
          skip: skip * (parseInt(page) - 1 || 0),
          limit: skip,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */

        res.status(200).json({
          success: true,
          data: blogs,
          total: totalBlogs,
          count: Math.ceil(totalBlogs / skip),
        });
        res.status(200).json({ success: true, data: blogs });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const blog = await Blogs.create({
          ...req.body,
        }); /* find all the data in our database */

        res.status(200).json({ success: true, data: blog });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
