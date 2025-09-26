import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Brands, { IBrand } from "models/Brands";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "POST"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await runMiddleware(req, res, cors);
    await dbConnect();

    const {
      method,
      headers: { authorization },
      query,
      body,
    } = req;

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
    switch (method) {
      // case "GET":
      //   // Pagination variables
      //   const skip = parseInt(query.limit as string, 10) ?? 10;
      //   const page = parseInt(query.page as string, 10) ?? 1;

      //   // Query parameters for name search
      //   const searchQuery = (query.search as string) ?? "";

      //   // Finding total count of brands matching the search query
      //   const totalBrandsCount = await Brands.countDocuments({
      //     name: { $regex: searchQuery, $options: "i" },
      //   });

      //   // Fetching brands with pagination and name search
      //   const brands = await Brands.find(
      //     {
      //       name: { $regex: searchQuery, $options: "i" },
      //     },
      //     null,
      //     {
      //       skip: skip * (page - 1),
      //       limit: skip,
      //     }
      //   ).sort({ createdAt: -1 });
      //   res.status(200).json({
      //     success: true,
      //     data: brands,
      //     count: Math.ceil(totalBrandsCount / skip),
      //   });
      //   break;

      //
      //
      case "GET":
        try {
          const { limit = "10", page = "1", search = "" } = query;

          const skip = parseInt(limit as string) || 10;
          const totalBrandsCount = await Brands.find({
            name: { $regex: search, $options: "i" },
          });

          const brands = await Brands.find(
            {
              name: { $regex: search, $options: "i" },
            },
            null,
            {
              skip: skip * (parseInt(page as string) - 1 || 0),
              limit: skip,
            }
          ).sort({
            createdAt: -1,
          });

          res.status(200).json({
            success: true,
            data: brands,
            count: Math.ceil(totalBrandsCount.length / skip),
          });
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
        break;
      //
      //

      case "POST":
        const { logo, ...others } = body;
        const blurDataUrl = await getBlurDataURL(logo?.url);

        // Creating a new brand
        const newBrand = await Brands.create({
          ...others,
          logo: {
            ...logo,
            blurDataUrl,
          },
          totalItems: 0,
        });

        res
          .status(201)
          .json({ success: true, data: newBrand, message: "brand-created" });
        break;

      default:
        res.status(400).json({ success: false });
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
