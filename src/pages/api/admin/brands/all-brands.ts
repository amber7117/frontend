import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Brands, { IBrand } from "models/Brands";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<IBrand[]>>
) {
  try {
    await runMiddleware(req, res, cors);

    const {
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

    try {
      // Perform any additional checks on the status if required

      switch (method) {
        case "GET":
          const brands = await Brands.find({});

          res.status(200).json({
            success: true,
            data: brands,
          });
          break;
        default:
          res.status(400).json({ success: false });
          break;
      }
    } catch (error) {
      res.status(401).json({ success: false, message: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
