import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Categories, { ICategory } from "models/Categories";
import SubCategories from "models/SubCategories";

// Define the interface for the category object
interface ICategoryResponse {
  success: boolean;
  data: ICategory[];
}

// Define the response data type
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ICategoryResponse>
) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        await SubCategories.findOne();
        const categories: ICategory[] = await Categories.find().populate({
          path: "subCategories",
        });

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
