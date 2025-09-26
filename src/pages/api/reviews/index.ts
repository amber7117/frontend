import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";
import Products from "models/Products";
import Orders from "models/Orders";
import Users from "models/Users";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();
  const session: any = await getServerSession(req, res, authOptions);

  switch (method) {
    case "GET":
      try {
        const reviews = await Reviews.find({}, null, {
          limit: 1,
        }).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: reviews });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        if (!session) {
          res.status(400).json({ success: false, message: "please-login" });
        }

        const user = await Users.findOne({
          email: session.user.email,
        });
        const orders = await Orders.find({
          "user.email": session.user.email,
          "items.pid": {
            $gte: req.body.product,
          },
        });
        const review = await Reviews.create({
          ...req.body,
          user: user._id,
          isPurchased: Boolean(orders?.length),
        }); /* find all the data in our database */

        await Products.findByIdAndUpdate(req.body.product, {
          $addToSet: {
            reviews: review._id,
          },
        });
        res.status(200).json({ success: true, data: review, user });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
