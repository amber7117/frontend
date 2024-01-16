import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/dbConnect";
import Admins from "models/Admins";
import Cors from "cors";
import runMiddleware from "lib/cors";
import { isValidToken, jwtDecode } from "src/utils/jwt";
import bcrypt from "bcrypt";
// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
});

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
  await runMiddleware(req, res, cors);
  const {
    body,
    method,
    headers: { authorization },
  } = req;

  if (!authorization) {
    res.status(401).json({ success: false, message: "unauthorized" });
    return;
  }

  // Token validation
  const isValid = isValidToken(authorization);

  if (!isValid) {
    res.status(401).json({ success: false, message: "token-expired" });
    return;
  }
  await dbConnect();
  switch (method) {
    case "PUT" /* Edit a model by its ID */:
      try {
        const { email }: any = jwtDecode(authorization);
        const admin = await Admins.findOne({ email: email }).select("password");

        if (!admin) {
          return res
            .status(400)
            .json({ success: false, message: "user-not-found" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(
          body.password,
          admin?.password
        );

        if (!isPasswordValid) {
          return res.status(401).json({ message: "old-password-incorrect" });
        }

        const updated = await Admins.findByIdAndUpdate(
          admin._id,
          {
            password: bcrypt.hashSync(
              req.body.newPassword,
              "$2a$10$CwTycUXWue0Thq9StjUM0u"
            ),
          },
          {
            new: true,
            runValidators: true,
          }
        );

        res.status(200).json({ success: true, message: "password-changed" });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
