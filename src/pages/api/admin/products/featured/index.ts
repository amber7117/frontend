import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { multiFilesDelete } from "src/utils/uploader";
import type { NextApiRequest, NextApiResponse } from "next";

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
    query: { id },
    method,
    headers: { authorization },
  } = req;

  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const products = await Products.find({
          status: "featured",
        }).select([
          "_id",
          "cover",
          "price",
          "priceSale",
          "totalRating",
          "totalReview",
          "status",
          "available",
          "createdAt",
        ]);

        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const updated = await Products.findByIdAndUpdate(
          id,
          {
            ...req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );
        res
          .status(200)
          .json({ success: true, data: updated, message: "updated-success" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const product = await Products.findOne({ _id: id });
        const { images }: any = product;
        await multiFilesDelete(images || []);

        const deleteProduct = await Products.deleteOne({ _id: id });
        if (!deleteProduct) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, message: "deleted-success" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
