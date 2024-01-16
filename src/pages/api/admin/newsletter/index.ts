import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Newsletter from "models/Newsletter";
import Cors from "cors";
import runMiddleware from "lib/cors";
import { isValidToken } from "src/utils/jwt";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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

  switch (method) {
    case "GET":
      try {
        const skip = 10;
        const NewsletterTotal = await Newsletter.find({}, null, {}).sort({
          createdAt: -1,
        });

        const page: number = parseInt(req.query.page as string) || 1;

        const data = await Newsletter.find({}, null, {
          skip: skip * (page - 1),
          limit: skip,
        }).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          data: data,
          count: Math.ceil(NewsletterTotal.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
