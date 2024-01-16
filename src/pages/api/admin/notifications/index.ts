import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Notifications from "models/Notifications";
import Cors from "cors";
import runMiddleware from "lib/cors";
import { isValidToken } from "src/utils/jwt";
// import { Callback, NextHandler } from "connect";

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

  switch (method) {
    case "GET":
      try {
        const page: any = query.page;
        const skip = page * 10;

        // Retrieve total count of notifications
        const notificationsTotal = await Notifications.find({}, null, {}).sort({
          createdAt: -1,
        });

        // Retrieve paginated notifications
        const notifications = await Notifications.find({}, null, {
          limit: skip,
        }).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          notifications: notifications,
          total: Math.ceil(notificationsTotal.length / 10),
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      // Create a new notification
      await Notifications.create({
        ...req.body,
      });

      res.status(200).json({
        success: true,
        data: "Notification added!",
        message: "notification-added",
      });
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
