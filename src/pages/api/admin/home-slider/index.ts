import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import runMiddleware from "lib/cors";
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
        const slides: IHomeSlider[] = await HomeSlider.find({}).sort({
          createdAt: -1,
        });
        res.status(200).json({ success: true, data: slides });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { cover, ...others } = req.body;
        const blurDataUrl = await getBlurDataURL(req.body.cover.url);

        await HomeSlider.create({
          ...others,
          cover: {
            ...cover,
            blurDataUrl,
          },
        });

        res.status(201).json({ success: true, message: "banner-updated" });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
