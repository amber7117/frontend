import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminRoles from "models/Admins";
import Cors from "cors";
import { checkStatus } from "src/utils/checkStatus";
import jwtDecode from "jwt-decode";
import type { NextApiRequest, NextApiResponse } from "next";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});
type Data = {
  success?: boolean;
  message?: string;
  data?: any;
  count?: number;
  token?: any;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    headers: { authorization },
    method,
  } = req;
  const { _id: clientId, status } = jwtDecode<any>(authorization as any);
  checkStatus(res, status);
  await dbConnect();

  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const updated = await AdminRoles.findOneAndUpdate(
          { clientId: clientId },
          { "profile.currency": req.body.currency },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!updated) {
          return res
            .status(400)
            .json({ success: false, message: "something-went-wrong" });
        }
        res.status(200).json({ success: true, message: "currency-changed" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
