import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Users from "models/Users";
import { isValidToken, jwtDecode } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
  token?: any;
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
        const { sub: _id } = jwtDecode<any>(authorization);
        const orders = await Orders.find({ "user._id": _id });
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "POST":
      try {
        const user = await Users.create(req.body);
        res.status(200).json({ success: true, data: user });
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
