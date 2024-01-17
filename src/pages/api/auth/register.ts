import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import jwt from "jsonwebtoken";
import axios from "axios";

type Data = {
  success?: boolean;
  message?: string;
  token?: string;
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
        const isAlready = await Users.findOne({
          email: req.body.email,
        });
        if (isAlready) {
          return res.status(400).json({
            success: false,
            message: "email-already-exist",
          });
        }

        const user = await Users.create({
          ...req.body,
          fullName: req.body.firstName + " " + req.body.lastName,
          status: "not-verified",
          joined: Date.now(),
        }); /* create a new model in the database */
        const token = jwt.sign(
          {
            email: user.email,
          },
          `security`,
          {
            expiresIn: 60 * 60,
          }
        );
        var data = JSON.stringify({
          service_id: "default_service",
          template_id: "template_d6xktym",
          user_id: "YWy1s44dsL8EaqbnU",
          template_params: {
            to_email: user.email,
            subject: "Verify your email",
            from_name: "GoGoGM",
            message: `
            <html lang="en"><head>
    <!-- font-family -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&amp;family=Montserrat:wght@300;400;500;600;700;800;900&amp;family=Poppins:wght@100;200;300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
    <!-- font-family -->
    <title>Verify Template</title>
  </head>
  <body data-new-gr-c-s-check-loaded="14.1108.0" data-gr-ext-installed="">
    <table style="
        background-color: #fff;
        text-align: center;
        margin: auto;
        width: 100%;
        max-width: 530px;
        padding: 30px 20px;
        box-shadow: -2px 0px 34px -8px rgba(173, 97, 97, 0.32);
      ">
      <tbody><tr>
        <td>
          <img src="https://i.ibb.co/bB1SyPz/clipboard-image.png" alt="clipboard-image" width="50">
        </td>
      </tr>
      <tr>
        <td>
          <h3 style="
              font-family: 'Montserrat', sans-serif;
              font-size: 25px;
              margin: 0;
              font-weight: 600;
              color: rgb(99, 115, 129);
              text-transform: capitalize;
            ">
            Verify your email address
          </h3>
        </td>
      </tr>
      <tr>
        <td>
          <p style="
              font-family: 'Montserrat', sans-serif;
              font-size: 14px;
              font-weight: 500;
              margin: 20px 0px;
              color: rgb(99, 115, 129);
              text-transform: capitalize;
            ">
            Please confirm that you want to use this as your Sellfy account
            email address. Once it's done you will be able to start selling
          </p>
        </td>
      </tr>
      <tr>
        <td>
        
          <a href="${process.env.DOMAIN}auth/verify-email?token=${token}">
            <button style="
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
              ">
              verify my email
            </button>
          </a>
        </td>
      </tr>
      <tr>
        <td>
          <p style="
              font-family: 'Montserrat', sans-serif;
              font-size: 12px;
              font-weight: 500;
              color: rgb(99, 115, 129);
              text-transform: capitalize;
            ">
            Copyright © 2022 Techgater. All rights reserved.
          </p>
        </td>
      </tr>
      <tr>
        <td>
          <!-- svg-1 -->
          <img src="https://i.ibb.co/RBTH437/facebook-logo-3-1-v77ls1.png" alt="facebook-logo-3-1-v77ls1" width="32" style="padding-right: 15px">

          <!-- svg-2 -->

          <img src="https://i.ibb.co/k18tTyv/wattsapp.png" alt="wattsapp" width="32" style="padding-right: 15px">
          <!-- svg-3 -->

          <img src="https://i.ibb.co/B6LBY8n/linkedin.png" alt="linkedin" width="32">
        </td>
      </tr>
    </tbody></table>
  

</body><grammarly-desktop-integration data-grammarly-shadow-root="true"></grammarly-desktop-integration></html>
            `,
          },
        });

        var config = {
          method: "post",
          url: "https://api.emailjs.com/api/v1.0/email/send",
          headers: {
            "Content-Type": "application/json",
            origin: "http://app.gogogm.com",
          },
          data: data,
        };

        axios(config)
          .then(function (response) {
            res.status(200).json({
              success: true,
            });
          })
          .catch(function (error) {
            res.status(400).json({
              success: false,
              message: error,
            });
          });
        res.status(200).json({
          success: true,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
