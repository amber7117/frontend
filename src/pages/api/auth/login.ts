import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import { generateToken } from "src/utils/jwt-config";

type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
  token?: string;
  user?: any;
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

        // Generate JWT token using centralized configuration
        const token = generateToken({
          _id: user._id.toString(),
          email: user.email,
          name: user.name || user.fullName || user.firstName,
          cover: user.cover || null,
          status: user.status,
          role: user.role,
        });

        res.status(200).json({
          success: true,
          message: "login-success",
          token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name || user.fullName || user.firstName,
            cover: user.cover,
            status: user.status,
            role: user.role,
            phone: user.phone,
          },
        });
      } catch (error: any) {
        res.status(400).json({ 
          success: false, 
          message: error.message || "An error occurred" 
        });
      }
      break;
    default:
      res.status(405).json({ 
        success: false, 
        message: "Method not allowed" 
      });
      break;
  }
}
