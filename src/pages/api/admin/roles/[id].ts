import runMiddleware from "lib/cors";
import dbConnect from "lib/dbConnect";
import AdminsModel from "models/Admins";
import Cors from "cors";
import { singleFileDelete } from "src/utils/uploader";
import { NextApiRequest, NextApiResponse } from "next";

// Initializing the cors middleware
const cors = Cors({
  methods: ["DELETE"],
});

// Define the response data type
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
    query: { id },
    method,
    headers,
  } = req;

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        // Find the user by ID
        const user = await AdminsModel.findOne({ _id: id });

        // Check if the user is an Owner, prevent deletion
        if (user?.role === "Owner") {
          res.status(400).json({ success: false, message: "delete-all-error" });
        } else {
          // Delete the associated file if available
          user?.cover?._id && (await singleFileDelete(user.cover._id));

          // Delete the user by ID
          const deleteRole = await AdminsModel.deleteOne({
            _id: id,
          });

          if (!deleteRole) {
            return res.status(400).json({ success: false });
          }

          res.status(200).json({ success: true, message: "removed-role" });
        }
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
