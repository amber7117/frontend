import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import { differenceInMinutes } from "date-fns";

type Data = {
  success?: boolean;
  message?: string;
  // type error
  data?: any;
  total?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    method,
    query: { oid },
  } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const orderCreated = await Orders.findById({ _id: oid });

        res.status(200).json({
          success: true,
          message: "order-created",
          data: orderCreated,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "PUT":
      try {
        const orderDetails: any = await Orders.findById({ _id: oid });
        const difference = differenceInMinutes(
          new Date(),
          new Date(orderDetails.createdAt)
        );
        if (difference > 10) {
          res.status(400).json({
            success: false,
            message: "order-cancel-message",
          });
        }
        await Orders.findByIdAndUpdate(oid, req.body, {
          new: true,
          runValidators: true,
        });

        res.status(200).json({
          success: true,
          message: "order-canceled",
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
