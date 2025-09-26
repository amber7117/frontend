import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel from "models/Admins";
import jwt from "jsonwebtoken";
import Cors from "cors";
import bcrypt from "bcrypt";

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
        ]);

        if (!user) {
          return res.status(401).json({ message: "invalid-email-error" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "invalid-password-error" });
        }

        // Create a JWT token that is valid for 7 days
        if (user.status === "active") {
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              name: user.name,
              cover: user.cover || null,
              status: user.status,
            },
            `secret key`,
            {
              expiresIn: "7d",
            }
          );

          // Return success response with token and user data
          res.status(200).json({
            success: true,
            token,
            user,
            message: "login-success",
          });
        } else {
          // Return error response if user account is not active
          res.status(200).json({
            success: false,
            message: "account-active-error",
          });
        }
      } catch (error) {
        // Return error response if an exception occurs
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      // Return error response for unsupported HTTP method
      res.status(400).json({ success: false });
      break;
  }
}
