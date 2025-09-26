import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import Orders from "models/Orders";
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
      try {
        const user = await Users.findOne({ _id: id });
        const skip = 10;
        const totalOrders = await Orders.find({ "user._id": id });
        const page = parseInt(req.query.page as string) || 1;
        const orders = await Orders.find({ "user._id": id }, null, {
          skip: skip * (page - 1),
          limit: skip,
        }).sort({ createdAt: -1 });

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "user-not-found" });
        }

        res.status(200).json({
          success: true,
          data: {
            user,
            orders,
            count: Math.ceil(totalOrders.length / skip),
          },
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT":
      try {
        const { status } = req.body;
        const user = await Users.findByIdAndUpdate(
          id,
          { status },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "user-not-found" });
        }

        res.status(200).json({ success: true, data: user, message: "success" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const deletedUser = await Users.deleteOne({ _id: id });

        if (!deletedUser) {
          return res
            .status(404)
            .json({ success: false, message: "user-not-found" });
        }

        res.status(200).json({ success: true, data: {}, message: "delete" });
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
