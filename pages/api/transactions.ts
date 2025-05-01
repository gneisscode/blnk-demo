import { NextApiRequest, NextApiResponse } from "next";
import { axiosWithToken } from "@/utils/axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query, body } = req;
  const { transactionId, ledgerId, balanceId, action } = query;

  try {
    const api = axiosWithToken();
    let response;

    switch (method) {
      case "GET":
        if (transactionId) {
          response = await api.get(`/transactions/${transactionId}`);
        } else if (ledgerId) {
          response = await api.get(`/ledgers/${ledgerId}/transactions`);
        } else if (balanceId) {
          response = await api.get(`/balances/${balanceId}/transactions`);
        } else {
          response = await api.get("/transactions");
        }
        break;

      case "POST":
        if (action === "hold") {
          response = await api.post("/transactions/hold", body);
        } else if (transactionId && action === "commit") {
          response = await api.post(`/transactions/${transactionId}/commit`);
        } else if (transactionId && action === "void") {
          response = await api.post(`/transactions/${transactionId}/void`);
        } else {
          response = await api.post("/transactions", body);
        }
        break;

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Error in transaction API:", error);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Failed to process request",
    });
  }
} 