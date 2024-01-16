import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Orders from "models/Orders";
import Products from "models/Products";
import Notifications from "models/Notifications";
import axios from "axios";

type Data = {
  success?: boolean;
  message?: string;
  // type error
  orderId?: any;
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
        const items = req.body.items;

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          await Products.findOneAndUpdate(
            {
              _id: item._id,
              available: { $gte: 0 },
            },
            {
              $inc: {
                available: -item.quantity,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          ).exec();
        }

        const orderCreated = await Orders.create({
          ...req.body,
          createdAt: Date.now(),
          user: {
            ...req.body.user,
            fullName:
              req.body.user.fullName ||
              req.body.user.firstName + " " + req.body.user.lastName,
          },
          status: "pending",
        });
        await Notifications.create({
          opened: false,
          title: `<b>${req.body.user.fullName}</b> is placed an order from ${req.body.user.city}.`,
          paymentMethod: req.body.paymentMethod,
          orderId: orderCreated._id,
          city: req.body.user.city,
          cover: req.body.user?.cover?.url || "",
          createdAt: Date.now(),
        });
        const newName =
          req.body.user.fullName ||
          req.body.user.firstName + " " + req.body.user.lastName;

        var data = JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_USER_ID,
          template_params: {
            to_email: req.body.user.email,
            from_name: "Nextstore",
            message: `Thanks ${newName} for placing an order. https://nextstore.vercel.com/orders/${orderCreated._id}`,
            to_name: newName,
            subject: "You have created a order at Nextstore.!",
          },
        });
        res.status(200).json({
          success: true,
          message: "order-placed",
          orderId: orderCreated._id,
        });
        // var config = {
        //   method: "post",
        //   url: "https://api.emailjs.com/api/v1.0/email/send",
        //   headers: {
        //     "Content-Type": "application/json",
        //     origin: "http://localhost",
        //   },
        //   data: data,
        // };

        // axios(config)
        //   .then(function (response) {
        //     res.status(200).json({
        //       success: true,
        //       message: "Order placed! Please check your email!",
        //       orderId: orderCreated._id,
        //     });
        //   })
        //   .catch(function (error) {
        //     res.status(400).json({
        //       success: false,
        //       message: "Something went wrong!",
        //     });
        //   });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
