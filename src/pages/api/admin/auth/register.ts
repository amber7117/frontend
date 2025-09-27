import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel, { IAdmin } from "models/Admins";
import { generateToken } from "src/utils/jwt-config";
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
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
        const isAlreadyAdmin = await AdminsModel.findOne({
          role: "Owner",
        });
        const isAlready = await AdminsModel.findOne({
          email: req.body.email,
        });

        if (!isAlready && !isAlreadyAdmin) {
          // Create a new admin model in the database
          const client: IAdmin = await AdminsModel.create({
            ...req.body,
            status: "active",
            role: "Owner",
          });

          // Generate JWT token using centralized configuration
          const token = generateToken({
            _id: client._id.toString(),
            email: client.email,
            name: client.name,
            cover: client.cover || null,
            status: client.status,
            role: client.role,
          });

          res.status(200).json({
            success: true,
            message: "login-success",
            token,
            user: {
              _id: client._id.toString(),
              email: client.email,
              name: client.name,
              cover: client.cover,
              status: client.status,
              role: client.role,
            },
          });
        } else {
          // Handle errors for existing admin or email
          if (isAlreadyAdmin) {
            res.status(400).json({
              success: false,
              message: "admin-role-error",
            });
          } else {
            res.status(400).json({
              success: false,
              message: "email-exist-error",
            });
          }
        }
      } catch (error: any) {
        let errorMessage: string = "something-went-wrong-error";
        if (error.name === "ValidationError") {
          // Handle validation errors
          const validationErrors = Object.values(error.errors).map(
            (err: any) => err.message
          );
          errorMessage = validationErrors[0] || errorMessage;
        }
        res.status(400).json({ 
          success: false, 
          message: errorMessage 
        });
      }
      break;
    default:
      // Handle unsupported HTTP methods
      res.status(405).json({ 
        success: false, 
        message: "Method not allowed" 
      });
      break;
  }
}
