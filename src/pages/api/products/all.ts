import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import _ from "lodash";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const products = await Products.find(
          {
            status: { $ne: "disabled" },
          },
          null,
          {}
        ).select(["category", "brand", "colors", "sizes", "priceSale", "name"]);
        /* find all the data in our database */
        res.status(200).json({
          success: true,
          data: products,
          total: products.length,
          company: "nextstore",
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
