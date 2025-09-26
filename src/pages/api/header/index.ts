import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Notifications from "models/UserNotifications";
import SubCategories from "models/SubCategories";
import Categories from "models/Categories";
import { isValidToken } from "src/utils/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    headers: { authorization },
  } = req;

  // if (!authorization) {
  //   res.status(401).json({ success: false, message: "Unauthorized" });
  //   return;
  // }

  // // Token validation
  // const isValid = isValidToken(authorization);

  // if (!isValid) {
  //   res.status(401).json({ success: false, message: "Token expired" });
  //   return;
  // }

  await dbConnect();

  try {
    switch (method) {
      case "GET":
        const subCategory = await SubCategories.findOne({});
        const categories = await Categories.find({}).populate({
          path: "subCategories",
        });
        const notifications = await Notifications.find({}).sort({
          createdAt: -1,
        });

        res.status(200).json({ success: true, notifications, categories });
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "header-error" });
  }
}
