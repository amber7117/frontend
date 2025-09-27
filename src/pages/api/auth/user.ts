import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import authOptions from "./[...nextauth]";

type Data = {
  success?: boolean;
  message?: string;
  status?: boolean;
  token?: string;
  user?: any;
};

async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await dbConnect();
  
  const { method } = req;
  
  // Get session using NextAuth
  const session: any = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      status: false,
    });
  }
  
  switch (method) {
    case "GET":
      try {
        const user = await Users.findOne({
          email: session.user.email,
        });

        if (!user) {
          return res.status(404).json({
            message: "User not found",
            status: false,
          });
        }

        res.status(200).json({
          success: true,
          message: "User profile retrieved successfully",
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

export default userHandler;
