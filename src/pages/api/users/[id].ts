import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import authOptions from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getBlurDataURL } from "src/utils/getBlurDataURL";
type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
  token?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    headers: { authorization },
    method,
  } = req;

  await dbConnect();
  // type error
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return;
  }
  const email = session.user.email;
  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await Users.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      try {
        const { cover, ...others } = req.body;
        const blurDataUrl = await getBlurDataURL(req.body.cover.url);
        const updated = await Users.findOneAndUpdate(
          { email: email },
          {
            ...others,
            cover: {
              ...cover,
              blurDataUrl,
            },
          }
        );

        if (!updated) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: { ...req.body, email } });
        return;
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
