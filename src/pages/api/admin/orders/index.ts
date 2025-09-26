import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
    query,
  } = req;
  const { status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        var newQuery = { ...query };
        delete newQuery.page;
        const skip = 10;
        const totalOrders = await Orders.find({
          "user.fullName": { $regex: query.search, $options: "i" },
        });
        const page: any = req.query.page;
        const orders = await Orders.find(
          {
            "user.fullName": { $regex: query.search, $options: "i" },
          },
          null,
          {
            skip: skip * (parseInt(page) - 1 || 0),
            limit: skip,
          }
        ).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          data: orders,
          count: Math.ceil(totalOrders.length / skip),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
