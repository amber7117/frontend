import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Newsletter from "models/Newsletter";
import Cors from "cors";
import runMiddleware from "lib/cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        // Create a new Newsletter document
        await Newsletter.create({
          email: req.body.email,
          createdAt: new Date(),
        });

        res.status(200).json({
          success: true,
          message: "newsletter-added",
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: "failed-to-add-newsletter",
        });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
