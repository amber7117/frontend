import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel, { IAdmin } from "models/Admins";
import { generateToken } from "src/utils/jwt-config";
import Cors from "cors";
import bcrypt from "bcrypt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST"],
});

type Data = {
  success?: boolean;
  message?: string;
  token?: string;
  user?: any;
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
        const { email, password } = req.body;

        // Find the user by email
        const user = await AdminsModel.findOne({ email }).select([
          "email",
          "password",
          "name",
          "cover",
          "status",
          "role",
        ]);

        if (!user) {
          return res.status(401).json({ 
            success: false,
            message: "invalid-email-error" 
          });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false,
            message: "invalid-password-error" 
          });
        }

        // Create a JWT token that is valid for 7 days
        if (user.status === "active") {
          const token = generateToken({
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            cover: user.cover || null,
            status: user.status,
            role: user.role || "admin",
          });

          // Return success response with token and user data
          res.status(200).json({
            success: true,
            token,
            user: {
              _id: user._id.toString(),
              email: user.email,
              name: user.name,
              cover: user.cover,
              status: user.status,
              role: user.role,
            },
            message: "login-success",
          });
        } else {
          // Return error response if user account is not active
          res.status(403).json({
            success: false,
            message: "account-active-error",
          });
        }
      } catch (error: any) {
        // Return error response if an exception occurs
        res.status(400).json({ 
          success: false, 
          message: error.message || "An error occurred" 
        });
      }
      break;
    default:
      // Return error response for unsupported HTTP method
      res.status(405).json({ 
        success: false, 
        message: "Method not allowed" 
      });
      break;
  }
}
