import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories, { ICategory } from "models/Categories";
import Cors from "cors";
import { singleFileDelete } from "src/utils/uploader";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const {
    query: { id },
    method,
    headers: { authorization },
  } = req;

  if (!authorization) {
    res.status(401).json({ success: false, message: "unauthorized" });
    return;
  }

  // Token validation
  const isValid: boolean = isValidToken(authorization); // Replace isValidToken with your own token validation logic

  if (!isValid) {
    res.status(401).json({ success: false, message: "token-expired" });
    return;
  }

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const category: ICategory | null = await Categories.findOne({
          _id: id,
        });

        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "item-could-not-be-found" });
        }

        res.status(200).json({
          success: true,
          data: category,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "category-could-not-be-found" });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const category: ICategory | null = await Categories.findOne({
          _id: id,
        });

        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "category-could-not-be-found" });
        }

        await singleFileDelete(category.cover?._id);
        await Categories.deleteOne({ _id: id });

        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        await Categories.findByIdAndUpdate(
          id,
          {
            ...req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return res.status(200).json({ success: true,message:"category-updated" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
