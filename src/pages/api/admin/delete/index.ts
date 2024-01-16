import type { NextApiRequest, NextApiResponse } from "next";
import runMiddleware from "lib/cors";
import { singleFileDelete } from "src/utils/uploader";
import Cors from "cors";
import jwtDecode from "jwt-decode";
import { checkStatus } from "src/utils/checkStatus";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

type Data = {
  success?: boolean;
  message?: string;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await runMiddleware(req, res, cors);
  const {
    method,
    headers: { authorization },
  } = req;
  // const { status } = jwtDecode(authorization);
  // checkStatus(res, status);

  switch (method) {
    case "DELETE" /* Delete a model by its ID */:
      try {
        await singleFileDelete(req.body._id);
        return res.status(201).json({ success: true, message: "delete" });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
