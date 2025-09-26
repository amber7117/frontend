import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import _ from "lodash";

type Data = {
  success?: boolean;
  message?: string;
  // type error
  data?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  await dbConnect();
  switch (method) {
    case "GET":
      try {
        // // Run the middleware

        const totalProducts = await Products.find({
          status: { $ne: "disabled" },
        }).select(["colors", "sizes", "price", "gender"]);
        const mappedColors = totalProducts.map((v: any) => v.colors);
        const totalGenders: any = new Set(
          totalProducts.map((item: any) => item.gender)
        );
        // type error
        const mappedGender: any = [...totalGenders];

        const mappedSizes = totalProducts.map((v: any) => v.sizes);
        const mappedPrices = totalProducts.map((v: any) => v.price);
        const min = Math.min(...mappedPrices);
        const max = Math.max(...mappedPrices);

        /* find all the data in our database */
        res.status(200).json({
          success: true,

          data: {
            colors: _.union(...mappedColors),
            sizes: _.union(...mappedSizes),
            prices: [min, max],
            gender: mappedGender,
          },
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
