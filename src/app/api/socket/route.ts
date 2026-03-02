import { NextApiRequest, NextApiResponse } from "next";
import { initSocketServer, NextApiResponseServerIo } from "@/lib/socket";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse & NextApiResponseServerIo
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  initSocketServer(req, res);
  res.status(200).json({ success: true, message: "Socket server initialized" });
}
