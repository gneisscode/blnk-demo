import { NextApiRequest, NextApiResponse } from 'next';
import blnkApi from '@/utils/axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sourceBalanceId, destinationBalanceId, amount, reference, description } = req.body;

    const response = await blnkApi.post('/transactions', {
      amount: amount,
      precision: 100,
      reference: reference,
      description: description || "Transfer between wallets",
      currency: "USD",
      source: sourceBalanceId,
      destination: destinationBalanceId,
      meta_data: {
        transaction_type: "internal_transfer",
        purpose: "wallet_transfer"
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error processing transfer:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Error processing transfer'
    });
  }
} 