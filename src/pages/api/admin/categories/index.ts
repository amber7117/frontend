import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories, { ICategory } from "models/Categories";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const {
    method,
    headers: { authorization },
    query,
  } = req;
  if (!authorization) {
    res.status(401).json({ success: false, message: "unauthorized" });
    return;
  }
  // Token validation
  const isValid = isValidToken(authorization);

  if (!isValid) {
    res.status(401).json({ success: false, message: "token-expired" });
    return;
  }
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { limit = "10", page = "1", search = "" } = query;

        const skip = parseInt(limit as string) || 10;
        const totalCategories = await Categories.find({
          name: { $regex: search, $options: "i" },
        });

        const categories = await Categories.find(
          {
            name: { $regex: search, $options: "i" },
          },
          null,
          {
            skip: skip * (parseInt(page as string) - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          data: categories,
          count: Math.ceil(totalCategories.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const { cover, ...others } = req.body;
        const blurDataUrl = await getBlurDataURL(req.body.cover.url);

        await Categories.create<ICategory>({
          ...others,
          cover: {
            ...cover,
            blurDataUrl,
          },
        });

        res.status(201).json({ success: true, message: "category-created" });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
