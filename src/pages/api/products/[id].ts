import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Products from "models/Products";
import { paramCase } from "change-case";

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
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const products = await Products.find({
          status: { $ne: "disabled" },
        });
        const filtered = products.filter((v) => paramCase(v.name) === id)[0];
        if (!filtered) {
          return res
            .status(400)
            .json({ success: false, message: "item-not-found" });
        }
        res.status(200).json({ success: true, data: filtered });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
