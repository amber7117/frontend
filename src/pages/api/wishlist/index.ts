import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Wishlist from "models/Wishlist";
import Products from "models/Products";
import Users from "models/Users";
import authOptions from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  await dbConnect();
  const session: any = await getServerSession(req, res, authOptions);

  if (!session) {
    return;
  }

  const email = session.user.email as any;

  switch (method) {
    case "GET":
      try {
        // Find the user based on the email address
        const user = await Users.findOne({
          email: email,
        });

        // Find the wishlist associated with the user and populate the products
        const wishlist = await Wishlist.findOne({
          uid: user._id,
        }).populate("wishlist");

        res.status(200).json({
          success: true,
          data: wishlist?.wishlist || [],
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    case "POST":
      try {
        // Find the user based on the email address
        const user = await Users.findOne({
          email: email,
        });

        // Check if the user already has a wishlist
        const isAlready = await Wishlist.findOne({
          uid: user._id,
        });

        if (!isAlready) {
          // Create a new wishlist for the user if it doesn't exist
          await Wishlist.create({
            uid: user._id,
            wishlist: [req.body.pid],
          });

          // Increment the likes for the product
          await Products.findByIdAndUpdate(req.body.pid, {
            $inc: { likes: 1 },
          });

          // Retrieve the updated wishlist and populate the products
          const data = await Wishlist.findOne({
            uid: user._id,
          }).populate("wishlist");

          res.status(200).json({
            success: true,
            data: data?.wishlist || [],
            type: "pushed",
            message: "added-to-wishlist",
          });

          return;
        }

        // Check if the product is already in the wishlist
        const filtered = await Wishlist.findOne({
          uid: user._id,
          wishlist: {
            $in: req.body.pid,
          },
        });

        if (!filtered) {
          // Add the product to the wishlist
          await Wishlist.findOneAndUpdate(
            {
              uid: user._id,
            },
            {
              $push: {
                wishlist: req.body.pid,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );

          // Increment the likes for the product
          await Products.findByIdAndUpdate(req.body.pid, {
            $inc: { likes: 1 },
          });

          // Retrieve the updated wishlist and populate the products
          const data = await Wishlist.findOne({
            uid: user._id,
          }).populate("wishlist");

          res.status(200).json({
            success: true,
            type: "pushed",
            message: "added-to-wishlist",
            data: data?.wishlist || [],
          });

          return;
        }

        // Remove the product from the wishlist
        await Wishlist.findOneAndUpdate(
          {
            uid: user._id,
          },
          {
            $pull: {
              wishlist: req.body.pid,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        // Decrement the likes for the product
        await Products.findByIdAndUpdate(req.body.pid, {
          $inc: { likes: -1 },
        });

        // Retrieve the updated wishlist and populate the products
        const data = await Wishlist.findOne({
          uid: user._id,
        }).populate("wishlist");

        res.status(200).json({
          success: true,
          type: "pulled",
          message: "remove-from-wishlist",
          data: data?.wishlist || [],
        });

        return;
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
