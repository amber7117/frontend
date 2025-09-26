import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import { singleFileDelete } from "src/utils/uploader";
import dbConnect from "lib/dbConnect";
import Categories from "models/SubCategories";
import Cors from "cors";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import ParentCategories from "models/Categories";
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

  // Check authorization
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

  // Connect to the da
  await dbConnect();
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const category = await Categories.findOne({
          _id: id,
        });
        if (!category) {
          return res
            .status(400)
            .json({ success: false, message: "category-could-not-be-found" });
        }
        res.status(200).json({
          success: true,
          data: category,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        const category = await Categories.findOne({ _id: id });
        await singleFileDelete(category.cover._id);
        await Categories.deleteOne({ _id: id });
        await ParentCategories.findByIdAndUpdate(category.parentCategory, {
          $pull: {
            subCategories: id,
          },
        });
        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT" /* Edit a model by its ID */:
      try {
        const { cover, ...others } = req.body;
        const blurDataUrl = await getBlurDataURL(req.body.cover.url);
        const oldCategory = await Categories.findOne({ _id: id });
        await Categories.findByIdAndUpdate(
          id,
          {
            ...others,
            cover: {
              ...cover,
              blurDataUrl,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        if (
          Boolean(others.parentCategory) &&
          oldCategory?.parentCategory !== others.parentCategory
        ) {
          await ParentCategories.findByIdAndUpdate(
            oldCategory?.parentCategory,
            {
              $pull: {
                subCategories: id,
              },
            }
          );
          await ParentCategories.findByIdAndUpdate(others.parentCategory, {
            $addToSet: {
              subCategories: id,
            },
          });
        }

        return res
          .status(200)
          .json({ success: true, message: "category-updated" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
