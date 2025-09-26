import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import { paramCase } from "change-case";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
import { multiFilesDelete } from "src/utils/uploader";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

/**
 * Handler function for the product API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        const products = await Products.find({});
        const filtered = products.filter((v) => paramCase(v.name) === id)[0];
        if (!filtered) {
          return res
            .status(400)
            .json({ success: false, message: "item-could-not-be-found" });
        }
        res.status(200).json({ success: true, data: filtered });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
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
        const updated = await Products.findOneAndUpdate(
          { slug: id },
          {
            ...req.body,
            cover: images[0].url,
            blurDataUrl: blurDataUrl,
          },
          { new: true, runValidators: true }
        );
        res
          .status(200)
          .json({ success: true, data: updated, message: "product-updated" });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case "DELETE":
      try {
        const product = await Products.findOne({ slug: id });
        const length: any = product?.variants?.length;
        for (let i = 0; i < length || 0; i++) {
          await multiFilesDelete(product?.variants[i].images);
        }

        const deleteProduct = await Products.deleteOne({ slug: id });
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
