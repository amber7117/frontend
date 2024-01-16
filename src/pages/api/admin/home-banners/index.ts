import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import runMiddleware from "lib/cors";
import HomeBanners from "models/HomeBanners";
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
        const banners = await HomeBanners.find({}).sort({
          createdAt: -1,
        }); /* find all the data in our database */
        res.status(200).json({
          success: true,
          data: banners.length > 0 ? banners[0] : null,
        });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const banners = await HomeBanners.find({});

        const blurDataUrl1 = await getBlurDataURL(
          req.body.bannerAfterSlider1.cover.url
        );
        const blurDataUrl2 = await getBlurDataURL(
          req.body.bannerAfterSlider2.cover.url
        );
        const blurDataUrl3 = await getBlurDataURL(
          req.body.bannerAfterSlider3.cover.url
        );
        const blurDataUrl4 = await getBlurDataURL(
          req.body.centeredBanner.cover.url
        );
        if (banners.length > 0) {
          await HomeBanners.findByIdAndUpdate(
            banners[0]._id,
            {
              bannerAfterSlider1: {
                ...req.body.bannerAfterSlider1,
                cover: {
                  ...req.body.bannerAfterSlider1.cover,
                  blurDataUrl: blurDataUrl1,
                },
              },
              bannerAfterSlider2: {
                ...req.body.bannerAfterSlider2,
                cover: {
                  ...req.body.bannerAfterSlider2.cover,
                  blurDataUrl: blurDataUrl2,
                },
              },
              bannerAfterSlider3: {
                ...req.body.bannerAfterSlider3,
                cover: {
                  ...req.body.bannerAfterSlider3.cover,
                  blurDataUrl: blurDataUrl3,
                },
              },
              centeredBanner: {
                ...req.body.centeredBanner,
                cover: {
                  ...req.body.centeredBanner.cover,
                  blurDataUrl: blurDataUrl4,
                },
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          res.status(201).json({ success: true, message: "banner-updated" });
        } else {
          await HomeBanners.create({
            bannerAfterSlider1: {
              ...req.body.bannerAfterSlider1,
              cover: {
                ...req.body.bannerAfterSlider1.cover,
                blurDataUrl: blurDataUrl1,
              },
            },
            bannerAfterSlider2: {
              ...req.body.bannerAfterSlider2,
              cover: {
                ...req.body.bannerAfterSlider2.cover,
                blurDataUrl: blurDataUrl2,
              },
            },
            bannerAfterSlider3: {
              ...req.body.bannerAfterSlider3,
              cover: {
                ...req.body.bannerAfterSlider3.cover,
                blurDataUrl: blurDataUrl3,
              },
            },
            centeredBanner: {
              ...req.body.centeredBanner,
              cover: {
                ...req.body.centeredBanner.cover,
                blurDataUrl: blurDataUrl4,
              },
            },
          });
          res.status(201).json({ success: true, message: "banner-updated" });
        }
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
