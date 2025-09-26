import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel from "models/Admins";
import jwt from "jsonwebtoken";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
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
        const isAlreadyAdmin = await AdminsModel.findOne({
          role: "Owner",
        });
        const isAlready = await AdminsModel.findOne({
          email: req.body.email,
        });

        if (!isAlready && !isAlreadyAdmin) {
          // Create a new admin model in the database
          const client = await AdminsModel.create({
            ...req.body,
            status: "active",
            role: "Owner",
          });

          // Generate JWT token
          const token = jwt.sign(
            {
              _id: client._id,
              email: client.email,
              name: client.name,
              cover: client.cover,
              status: client.status,
            },
            "secret",
            {
              expiresIn: "7d",
            }
          );

          res.status(200).json({
            success: true,
            message: "login-success",
            token,
          });
        } else {
          // Handle errors for existing admin or email
          isAlreadyAdmin
            ? res.status(400).json({
                success: true,
                message: "admin-role-error",
              })
            : res.status(400).json({
                success: true,
                message: "email-exist-error",
              });
        }
      } catch (error) {
        let errorMessage: string | string[] = "something-went-wrong-error";
        if (error.name === "ValidationError") {
          // Handle validation errors
          const validationErrors = Object.values(error.errors).map(
            (err: any) => err.message
          );
          errorMessage = validationErrors;
        }
        res.status(400).json({ success: false, message: errorMessage[0] });
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.status(400).json({ success: false });
      break;
  }
}
