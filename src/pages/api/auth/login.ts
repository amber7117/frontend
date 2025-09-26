import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";

type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
  token?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;
        const user = await Users.findOne({
          email: email,
          password: password,
        });

        if (!user) {
          return res.status(404).json({
            message: "common:incorrect-email-password",
            status: false,
          });
        }

        // create a jwt token that is valid for 7 days
        const token = jwt.sign(
          {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            firstName: user.firstName,
            avatar: user.cover ? user.cover : null,
            status: user.status,
            phone: user.phone,
          },
          `absjdkas`,
          {
            expiresIn: "7d",
          }
        );
        res.status(200).json({
          success: true,
          message: "login-success",
          token,
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
