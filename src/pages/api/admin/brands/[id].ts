import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Brands, { IBrand } from "models/Brands";
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
  data?: IBrand;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
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
    const isValid = isValidToken(authorization);

    if (!isValid) {
      res.status(401).json({ success: false, message: "token-expired" });
      return;
    }

    await dbConnect();

    switch (method) {
      case "GET":
        // Get a model by its ID
        try {
          const brand = await Brands.findOne({ _id: id });

          if (!brand) {
            return res
              .status(400)
              .json({ success: false, message: "item-could-not-be-found" });
          }

          res.status(200).json({
            success: true,
            data: brand,
          });
        } catch (error) {
          res
            .status(400)
            .json({ success: false, message: "brand-could-not-be-found" });
        }
        break;

      case "DELETE":
        // Delete a model by its ID
        try {
          const brand = await Brands.findOne({ _id: id });

          if (!brand) {
            return res
              .status(400)
              .json({ success: false, message: "item-could-not-be-found" });
          }

          await singleFileDelete(brand?.logo?._id);
          await Brands.deleteOne({ _id: id });

          res.status(201).json({ success: true });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;

      case "PUT":
        // Edit a model by its ID
        try {
          await Brands.findByIdAndUpdate(
            id,
            {
              ...req.body,
            },
            {
              new: true,
              runValidators: true,
            }
          );

          res.status(200).json({ success: true, message: "brand-updated" });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
