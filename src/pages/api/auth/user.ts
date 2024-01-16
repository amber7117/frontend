import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";

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
  const {
    headers: { authorization },
    method,
  } = req.body;
  await dbConnect();
  const { email } = jwtDecode<any>(authorization);
  switch (method) {
    case "GET":
      try {
        const user = await Users.findOne({
          email: email,
        });

        if (!user) {
          res.status(404).json({
            message: "incorrect-email-password",
            status: false,
          });
        } else {
          // create a jwt token that is valid for 7 days
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              name: user.name,
              cover: user.cover ? user.cover : null,
              status: user.status,
            },
            `absjdkas`,
            {
              expiresIn: "7d",
            }
          );
          res.status(200).json({
            success: true,
            message: "updated-profile",
            token,
          });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
