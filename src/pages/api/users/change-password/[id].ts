import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import authOptions from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

type Data = {
  message?: string;
  success?: boolean;
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
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return;
  }
  await dbConnect();

  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const user = await Users.findOne({ _id: id }).select("password");
        if (user.password === req.body.password) {
          const user = await Users.findByIdAndUpdate(
            id,
            { password: req.body.newPassword },
            {
              new: true,
              runValidators: true,
            }
          );
          if (!user) {
            return res
              .status(400)
              .json({ success: false, message: "user-not-found" });
          }
          res.status(200).json({ success: true, message: "password-changed" });
        } else {
          res
            .status(400)
            .json({ success: false, message: "old-password-incorrect" });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
