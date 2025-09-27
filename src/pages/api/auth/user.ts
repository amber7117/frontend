import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import { generateToken } from "src/utils/jwt-config";
import { jwtAuthMiddleware, AuthenticatedRequest } from "src/middleware/jwt-auth";

type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
  token?: string;
  user?: any;
};

async function userHandler(
  req: AuthenticatedRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  
  const { method } = req;
  
  switch (method) {
    case "GET":
      try {
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: "Authentication required",
            status: false,
          });
        }

        const user = await Users.findOne({
          email: req.user.email,
        });

        if (!user) {
          return res.status(404).json({
            message: "User not found",
            status: false,
          });
        }

        // Generate new token with updated user data
        const newToken = generateToken({
          _id: user._id.toString(),
          email: user.email,
          name: user.name,
          cover: user.cover || null,
          status: user.status,
          role: user.role,
        });

        res.status(200).json({
          success: true,
          message: "User profile retrieved successfully",
          token: newToken,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            cover: user.cover,
            status: user.status,
            role: user.role,
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

export default jwtAuthMiddleware(userHandler);
