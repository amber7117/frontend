import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import { singleFileDelete } from "src/utils/uploader";
import dbConnect from "lib/dbConnect";
import HomeSlider, { IHomeSlider } from "models/HomeSlider";
import Cors from "cors";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
import { isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

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

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const slide: IHomeSlider | null = await HomeSlider.findOne({
          _id: id as string,
        });

        if (!slide) {
          return res
            .status(400)
            .json({ success: false, message: "item-could-not-be-found" });
        }

        res.status(200).json({
          success: true,
          data: slide,
        });
      } catch (error) {
        res
          .status(400)
          .json({ success: false, message: "category-could-not-be-found" });
      }
      break;

    case "PUT":
      try {
        const { cover, ...others } = req.body;
        const blurDataUrl = await getBlurDataURL(req.body.cover.url);

        await HomeSlider.findByIdAndUpdate(
          id as string,
          {
            ...others,
            cover: {
              ...cover,
              blurDataUrl,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        return res
          .status(200)
          .json({ success: true, message: "slider-updated" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const homeslide: IHomeSlider | null = await HomeSlider.findOne({
          _id: id as string,
        });

        if (!homeslide) {
          return res
            .status(400)
            .json({ success: false, message: "item-could-not-be-found" });
        }

        await singleFileDelete(homeslide?.cover?._id);
        await HomeSlider.deleteOne({ _id: id as string });

        return res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
