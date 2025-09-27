import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel from "models/Admins";
import Cors from "cors";
import { verifyToken, isTokenExpired } from "src/utils/jwt-config";
import bcrypt from "bcrypt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

// Define the response data type
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

        // Check if the token is valid and not expired
        const decoded = verifyToken(token);
        if (!decoded || isTokenExpired(token)) {
          return res.status(400).json({
            success: false,
            message: "expired-token-error",
          });
        }

        const { email } = decoded;

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the admin's password
        await AdminsModel.findOneAndUpdate(
          { email },
          {
            password: hashedPassword,
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({
          success: true,
          message: "new-password-created",
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
