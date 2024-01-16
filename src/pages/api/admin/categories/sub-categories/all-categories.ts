import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Categories, { ISubCategory } from "models/SubCategories";
import Cors from "cors";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

// Define the interface for the response data
type Data = {
  success?: boolean;
  message?: string;
  data?: ISubCategory[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the cors middleware
  await runMiddleware(req, res, cors);

  const {
    method,
    headers: { authorization },
  } = req;

  // Check authorization
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

  // Connect to the database
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Retrieve all categories
        const categories: ISubCategory[] = await Categories.find({});

        res.status(200).json({
          success: true,
          data: categories,
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
