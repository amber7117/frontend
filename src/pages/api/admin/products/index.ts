import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import Categories from "models/Categories";
import { isValidToken } from "src/utils/jwt";
import mongoose from "mongoose";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
};

/**
 * Handler function for the product API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const {
    method,
    headers: { authorization },
    query,
  } = req;

  await dbConnect();

  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);

  switch (method) {
    case "GET":
      try {
        await Categories.findOne();

        var newQuery = { ...query };
        delete newQuery.page;

        const skip = 10;

        const totalProducts = await Products.countDocuments({
          name: { $regex: query.search || "", $options: "i" },
        });

        const page: any = req.query.page || 1;

        const products = await Products.find(
          {
            name: { $regex: query.search || "", $options: "i" },
          },
          null,
          {
            skip: skip * (parseInt(page) - 1 || 0),
            limit: skip,
          }
        )
          .populate({
            path: "category",
          })
          .select([
            "_id",
            "cover",
            "status",
            "createdAt",
            "name",
            "slug",
            "isFeatured",
            "blurDataUrl",
            "variants",
          ])
          .sort({
            createdAt: -1,
          })
          .exec();

        res.status(200).json({
          success: true,
          data: products,
          count: Math.ceil(totalProducts / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
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

        const images = req.body.variants[0].images;
        const blurDataUrl = await getBlurDataURL(images[0].url);

        await Products.create({
          ...req.body,
          subCategory: Boolean(req.body.subCategory)
            ? req.body.subCategory
            : mongoose.Schema.Types.ObjectId,
          cover: images[0].url,
          blurDataUrl: blurDataUrl,
          likes: 0,
        });

        res.status(201).json({ success: true, message: "product-created" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
