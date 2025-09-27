import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Users from "models/Users";
import authOptions from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
type Data = {
  message?: string;
  success?: boolean;
  // type error
  data?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;
  const session: any = await getServerSession(req, res, authOptions);
  if (!session) {
    return;
  }
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        const users = await Users.find(
          {}
        ); /* find all the data in our database */

        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const { email } = req.body;
        await Users.findOne({})
          .select({ users: { $elemMatch: { email: email } } })
          .then((user) => {
            if (user) {
              res
                .status(400)
                .json({ success: false, message: "email-already-exist" });
              return;
            }
          });
        const user = await Users.create({
          ...req.body,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
