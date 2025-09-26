import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminModels from "models/Admins";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

// Define the response data type
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      // Retrieve all roles from the database
      const roles = await AdminModels.find({});
      res.status(200).json({
        success: true,
        data: roles,
      });
      break;
    case "POST":
      try {
        const isAlready = await AdminModels.findOne({
          email: req.body.email,
        });

        if (!isAlready) {
          // Create a new model in the database
          await AdminModels.create({
            ...req.body,
            status: "active",
          });
          res.status(200).json({
            success: true,
            message: "added-role",
          });
        } else {
          res.status(400).json({
            success: true,
            message: "email-exist",
          });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
