import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
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
        const skip = 10;
        const totalUsers = await Users.find({
          name: { $regex: query.search, $options: "i" },
        });
        const page = parseInt(req.query.page as string) || 1;
        const users = await Users.find(
          {
            name: { $regex: query.search, $options: "i" },
          },
          null,
          {
            skip: skip * (page - 1),
            limit: skip,
          }
        ).sort({ createdAt: -1 });

        res.status(200).json({
          success: true,
          data: users,
          count: Math.ceil(totalUsers.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res
        .status(400)
        .json({ success: false, message: "invalid-request-method" });
      break;
  }
}
