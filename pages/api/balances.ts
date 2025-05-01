import { NextApiRequest, NextApiResponse } from "next";
import { axiosWithToken } from "@/utils/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;
  const { balanceId, ledgerId } = query;

  try {
    const api = axiosWithToken();
    let response;

    switch (method) {
      case "GET":
        if (balanceId) {
          if (query.history) {
            response = await api.get(`/balances/${balanceId}/history`);
          } else {
            response = await api.get(`/balances/${balanceId}`);
          }
        } else if (ledgerId) {
          response = await api.get(`/ledgers/${ledgerId}/balances`);
        } else {
          response = await api.get("/balances");
        }
        break;

      case "POST":
        response = await api.post("/balances", body);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error in balance API:", error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to process request",
    });
  }
} 