import { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel from "models/Admins";
import jwt from "jsonwebtoken";
import Cors from "cors";
import axios from "axios";

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
        const { email, domain } = req.body;

        // Find the admin with the provided email
        const admin = await AdminsModel.findOne({ email });

        if (!admin) {
          // Handle the case when admin is not found
          return res.status(400).json({
            message: "user-not-found",
            success: false,
          });
        }

        const { _id, email: userEmail, name, cover, status } = admin;

        // Create a JWT token that is valid for 10 minutes
        const token = jwt.sign(
          {
            _id,
            email: userEmail,
            name,
            cover: cover || null,
            status,
          },
          "secret key",
          {
            expiresIn: "30m",
          }
        );

        var data = JSON.stringify({
          service_id: "service_kcodhc8",
          template_id: "template_wr6ek3f",
          user_id: "YWy1s44dsL8EaqbnU",
          template_params: {
            to_email: email,
            from_name: "Nextstore",
            subject: "Forget password!",
            message: `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <!-- font-family -->
                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                  <link
                    href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&family=Montserrat:wght@300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet"
                  />
                  <!-- font-family -->
                  <title>Reset Password</title>
                </head>
                <body>
                  <table
                    style="
                      background-color: #fff;
                      text-align: center;
                      margin: auto;
                      width: 100%;
                      max-width: 530px;
                      padding: 30px 20px;
                      border: 1px solid #eee;
                      border-radius: 4px;
                      box-shadow: -2px 0px 34px -8px rgba(173, 97, 97, 0.32);
                    "
                  >
                    <tr>
                      <td>
                        <img
                          src="https://i.ibb.co/bB1SyPz/clipboard-image.png"
                          alt="clipboard-image"
                          width="50"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h3
                          style="
                            font-family: 'Montserrat', sans-serif;
                            font-size: 25px;
                            margin: 0;
                            font-weight: 600;
                            color: rgb(99, 115, 129);
                            text-transform: capitalize;
                          "
                        >
                          Password Reset
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p
                          style="
                            font-family: 'Montserrat', sans-serif;
                            font-size: 14px;
                            font-weight: 500;
                            margin: 20px 0px;
                            color: rgb(99, 115, 129);
                            text-transform: capitalize;
                          "
                        >
                          if you did not request a password reset, you can safely ignore this
                          email. only a person with access to your email can reset your
                          account password.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <a href="${domain}/auth/reset-password?token=${token}">
                          <button
                            style="
                              height: 50px;
                              background-color: #ff2678;
                              border: none;
                              border-radius: 4px;
                              width: 100%;
                              color: #fff;
                              font-family: 'Montserrat', sans-serif;
                              font-size: 14px;
                              font-weight: 700;
                              cursor: pointer;
                              margin-bottom: 20px;
                              text-transform: capitalize;
                            "
                          >
                            Reset Your Password
                          </button>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p
                          style="
                            font-family: 'Montserrat', sans-serif;
                            font-size: 12px;
                            font-weight: 500;
                            color: rgb(99, 115, 129);
                            text-transform: capitalize;
                          "
                        >
                          Copyright © 2022 Techgater. All rights reserved.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <!-- svg-1 -->
                        <img
                          src="https://i.ibb.co/RBTH437/facebook-logo-3-1-v77ls1.png"
                          alt="facebook-logo-3-1-v77ls1"
                          width="32"
                          style="padding-right: 15px"
                        />
              
                        <!-- svg-2 -->
              
                        <img
                          src="https://i.ibb.co/k18tTyv/wattsapp.png"
                          alt="wattsapp"
                          width="32"
                          style="padding-right: 15px"
                        />
                        <!-- svg-3 -->
              
                        <img
                          src="https://i.ibb.co/B6LBY8n/linkedin.png"
                          alt="linkedin"
                          width="32"
                        />
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
              `,
          },
        });

        var config = {
          method: "post",
          url: "https://api.emailjs.com/api/v1.0/email/send",
          headers: {
            "Content-Type": "application/json",
            origin: "http://localhost",
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
            res.status(200).json({
              success: true,
              message: "sent-email",
            });
          })
          .catch(function (error) {
            res.status(400).json({
              success: false,
              message: "something-went-wrong",
            });
          });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
