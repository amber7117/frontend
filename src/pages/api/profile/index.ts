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
  const { method, query } = req;

  await dbConnect();
  const session: any = await getServerSession(req, res, authOptions);

  switch (method) {
    case "GET":
      try {
        const user = await Users.findOne({
          email: session.user.email,
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
