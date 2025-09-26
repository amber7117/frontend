import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwtDecode from "jwt-decode";

type Data = {
  success?: boolean;
  message?: string;
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
        const { email }: any = jwtDecode(req.body.token);
        if (email) {
          await Users.findOneAndUpdate(
            {
              email: email,
              status: "not-verified",
            },
            {
              status: "active",
            }
          );

          res.status(200).json({
            success: true,
          });
        }
        res
          .status(400)
          .json({ success: false, message: "something-went-wrong" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
