import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";
import Products from "models/Products";
import Orders from "models/Orders";
import Users from "models/Users";
import authOptions from "../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { isValidToken } from "src/utils/jwt";
import mongoose from "mongoose";

type Data = {
  message?: string;
  success?: any;
  data?: any;
  uid?: any;
};

/**
 * Handler function for the reviews API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
    headers: { authorization },
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      /* Get a model by its ID */
      try {
        const getProductRatingAndReviews = () => {
          return Products.aggregate([
            {
              $match: { _id: id },
            },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews",
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                rating: { $avg: "$reviews.rating" },
                totalReviews: { $size: "$reviews" },
              },
            },
          ]);
        };
        const getProductReviewCounts = () => {
          return Products.aggregate([
            {
              $match: { _id: id },
            },
            {
              $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "product",
                as: "reviews",
              },
            },
            {
              $unwind: "$reviews",
            },
            {
              $group: {
                _id: "$reviews.rating",
                count: { $sum: 1 },
              },
            },
          ]);
        };

        const reviewsSummery = await getProductReviewCounts();
        // Usage

        const reviewReport = await getProductRatingAndReviews();
        res.status(200).json({
          success: true,
          reviewsSummery,
          reviewReport,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
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
        const session: any = await getServerSession(req, res, authOptions);
        if (!session) {
          return;
        }

        const review = req.body;
        const isReview = await Reviews.findById(id);
        const product: any = await Products.findById(id);

        const user = await Users.findOne({
          email: session.user.email,
        });
        const uid = user._id;
        const user1 = await Users.findById(uid);
        res.status(201).json({ success: true, data: user1, uid: uid });

        const orders = await Orders.find({
          "user.email": user.email,
        });
        const isPurchased = orders.filter((v: any) =>
          v.items.some((val: { _id: string }) => val._id === id)
        );

        await Products.findByIdAndUpdate(
          id,
          {
            totalReview: product.totalReview + 1,
            totalRating: product.totalRating + review.rating,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (isReview) {
          const filtered = isReview.ratings.filter(
            (v: any) => v.name === `${review.rating} Star`
          )[0];
          const notFiltered = isReview.ratings.filter(
            (v: any) => v.name !== `${review.rating} Star`
          );

          const alreadyReview = await Reviews.findOneAndUpdate(
            { pid: id },
            {
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [
                ...isReview.reviews,
                {
                  ...review,
                },
              ],
            },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(201).json({ success: true, data: alreadyReview });
        } else {
          const ratingData = [
            {
              name: "1 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "2 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "3 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "4 Star",
              starCount: 0,
              reviewCount: 0,
            },
            {
              name: "5 Star",
              starCount: 0,
              reviewCount: 0,
            },
          ];
          const filtered = ratingData.filter(
            (v) => v.name === `${review.rating} Star`
          )[0];
          const notFiltered = ratingData.filter(
            (v) => v.name !== `${review.rating} Star`
          );
          const newreview = await Reviews.create([
            {
              pid: id,
              ratings: [
                ...notFiltered,
                {
                  name: `${review.rating} Star`,
                  reviewCount: filtered.reviewCount + 1,
                  starCount: filtered.starCount + 1,
                },
              ],
              reviews: [
                {
                  ...review,
                  _id: mongoose.Types.ObjectId,
                  isPurchased: orders && isPurchased.length > 0 ? true : false,
                  fullName: user.fullName,
                  avatar: user.cover ? user.cover.url : "",
                  email: user.email,
                },
              ],
            },
          ]);
          res.status(201).json({ success: true, data: newreview });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
