import { NextApiRequest, NextApiResponse } from "next";
import { axiosWithToken } from "@/utils/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;
  const { ledgerId } = query;

  try {
    const api = axiosWithToken();
    let response;

    switch (method) {
      case "GET":
        if (ledgerId) {
          response = await api.get(`/ledgers/${ledgerId}`);
        } else {
          response = await api.get("/ledgers");
        }
        break;

      case "POST":
        response = await api.post("/ledgers", body);
        break;

      case "PATCH":
        if (!ledgerId) {
          return res.status(400).json({ error: "Ledger ID is required" });
        }
        response = await api.patch(`/ledgers/${ledgerId}`, body);
        break;

      case "DELETE":
        if (!ledgerId) {
          return res.status(400).json({ error: "Ledger ID is required" });
        }
        response = await api.delete(`/ledgers/${ledgerId}`);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error in ledger API:", error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to process request",
    });
  }
}
