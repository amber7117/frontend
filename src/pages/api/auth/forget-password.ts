import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";
import Cors from "cors";
import axios from "axios";
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
        const { email } = req.body;
        const usersData = await Users.find({});

        const user = usersData.find((u) => u.email === email);

        if (!user) {
          res.status(400).json({
            message: "user-not-found",
            status: false,
          });
        } else {
          const {
            _id,
            email: userEmail,
            fullName,
            cover,
            status,
            firstName,
          } = user;
          // create a jwt token that is valid for 7 days
          const token = jwt.sign(
            {
              _id: _id,
              email: userEmail,
              fullName: fullName,
              firstName: firstName,
              cover: cover ? cover : null,
              status: status,
            },
            `secret key`,
            {
              expiresIn: "10m",
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
                        <a href="${process.env.DOMAIN}/auth/reset-password?token=${token}">
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
                message: "email-sent",
              });
            })
            .catch(function (error) {
              res.status(400).json({
                success: false,
                message: "something-went-wrong",
              });
            });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
