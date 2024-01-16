import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import { jwtDecode, isValidToken } from "src/utils/jwt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);

  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { newPassword, token } = req.body;
        const isValidtoken = isValidToken(token);

        if (!isValidtoken) {
          return res.status(400).json({
            success: false,
            message: "token-expired",
          });
        }

        const { _id } = jwtDecode<any>(token);

        await Users.findByIdAndUpdate(
          _id,
          {
            password: newPassword,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({
          success: true,
          message: "password-updated",
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
