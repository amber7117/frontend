import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import Addresses, { IAddress } from "models/Addresses";
import Cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import Users from "models/Users";

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);

  const {
    method,
    query,
    headers: { authorization },
  } = req;
  await dbConnect();
  switch (method) {
    case "PUT":
      try {
        if (req.body.active) {
          await Addresses.findOneAndUpdate(
            {
              active: true,
              user: req.body.user,
            },
            {
              active: false,
            }
          );
        }
        const address = await Addresses.findOneAndUpdate(
          {
            _id: query.id,
          },
          {
            ...req.body,
          }
        ).sort({
          createdAt: -1,
        });

        res.status(200).json({
          success: true,
          data: address,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    case "DELETE":
      try {
        const address = await Addresses.findOne({
          _id: query.id,
        });
        await Addresses.findOneAndDelete({
          _id: query.id,
        });

        await Users.findByIdAndUpdate(address?.user, {
          $unset: {
            addresses: address?._id,
          },
        });
        res.status(201).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: true, data: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
