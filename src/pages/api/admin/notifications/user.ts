import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Notifications from "models/UserNotifications";
import Cors from "cors";
import runMiddleware from "lib/cors";
import { isValidToken } from "src/utils/jwt";

const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  notifications?: any;
  total?: any;
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

  try {
    switch (method) {
      case "GET":
        const notifications = await Notifications.find({}, null, {}).sort({
          createdAt: -1,
        });
        res.status(200).json({
          success: true,
          notifications,
        });
        break;
      case "POST":
        await Notifications.create({
          ...req.body,
          createdAt: new Date().getTime(),
        });

        res.status(200).json({
          success: true,
          data: "Notification added!",
          message: "notification-added",
        });
        break;
      case "PUT":
        const _id: any = req.query.id;
        await Notifications.findOneAndUpdate(
          { _id },
          {
            ...req.body,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({
          success: true,
          message: "notification-updated",
        });
        break;
      case "DELETE":
        await Notifications.deleteOne({ _id: query.id });

        res.status(200).json({
          success: true,
          message: "notification-deleted",
        });
        break;
      default:
        res
          .status(400)
          .json({ success: false, message: "invalid-request-method" });
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
