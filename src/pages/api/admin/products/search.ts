import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
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

/**
 * Handler function for the product search API endpoint.
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
    body: { query },
  } = req;

  await dbConnect();

  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);

  switch (method) {
    case "POST":
      try {
        if (!authorization) {
          res.status(401).json({ success: false, message: "Unauthorized" });
          return;
        }

        // Token validation
        const isValid = isValidToken(authorization);

        if (!isValid) {
          res.status(401).json({ success: false, message: "Token expired" });
          return;
        }

        const products = await Products.find({
          name: { $regex: query, $options: "i" },
          skip: 15,
        }).select(["name", "price", "cover", "_id"]);

        res
          .status(200)
          .json({ success: true, data: products, message: "product-updated" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "GET":
      // Unsupported method
      res.status(400).json({ success: false });
      break;

    default:
      // Invalid method
      res.status(400).json({ success: false });
      break;
  }
}
