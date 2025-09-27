import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import { verifyToken, decodeToken, isTokenExpired } from "src/utils/jwt-config";

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
        
        // Check if token is expired using centralized configuration
        if (isTokenExpired(token)) {
          return res.status(400).json({
            success: false,
            message: "token-expired",
          });
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(400).json({
            success: false,
            message: "invalid-token",
          });
        }

        await Users.findByIdAndUpdate(
          decoded._id,
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
