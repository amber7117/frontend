import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Reviews from "models/Reviews";
import Products from "models/Products";
import Orders from "models/Orders";
import Cors from "cors";
import JSWTDecode from "jwt-decode";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: any;
  message?: string;
  data?: any;
  count?: number;
  token?: any;
};

/**
 * Handler function for the reviews API endpoint.
 * @param req NextApiRequest object representing the incoming request.
 * @param res NextApiResponse object representing the outgoing response.
 */
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

  await dbConnect();

  switch (method) {
    case "GET":
      /* Get a model by its ID */
      try {
        const reviews = await Reviews.findOne({ _id: id });

        if (!reviews) {
          return res
            .status(200)
            .json({ success: true, data: { ratings: [], reviews: [] } });
        }

        res.status(200).json({ success: true, data: reviews });
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

        const review = req.body;
        const uniqueId = Date.now();
        const isReview = await Reviews.findOne({ _id: id });
        const product: any = await Products.findOne({ _id: id });
        const user = JSWTDecode<any>(authorization as string);
        const order: any = await Orders.findOne({
          "user.email": user.email,
        });
        const isPurchased: any = order?.items.some(
          (item: any) => item._id === id
        );
        const updatedProduct = await Products.findByIdAndUpdate(
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
          const filtered = isReview.ratings.find(
            (rating: any) => rating.name === `${review.rating} Star`
          );
          const notFiltered = isReview.ratings.filter(
            (rating: any) => rating.name !== `${review.rating} Star`
          );

          const alreadyReview = await Reviews.findByIdAndUpdate(
            id,
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
                  _id: uniqueId,
                  isPurchased: order && isPurchased,
                  name: user.name,
                  cover: user.cover,
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

          const filtered: any = ratingData.find(
            (rating) => rating.name === `${review.rating} Star`
          );
          const notFiltered = ratingData.filter(
            (rating) => rating.name !== `${review.rating} Star`
          );

          const newReview = await Reviews.create([
            {
              _id: id,
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
                  _id: uniqueId,
                  isPurchased: order && isPurchased,
                  name: user.name,
                  cover: user.cover,
                },
              ],
            },
          ]);

          res.status(201).json({ success: true, data: newReview });
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
