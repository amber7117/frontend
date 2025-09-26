import type { NextApiRequest, NextApiResponse } from "next";
import { singleFileDelete } from "src/utils/uploader";
type Data = {
  success?: boolean;
  message?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    body: { _id },
    method,
  } = req;
  switch (method) {
    case "DELETE" /* Get a model by its ID */:
      try {
        const result = await singleFileDelete(_id);
        res.status(200).json({ success: true, message: result });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
