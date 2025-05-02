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
    const { balanceId, amount, reference, description } = req.body;

    const response = await blnkApi.post('/transactions', {
      amount: amount,
      precision: 100,
      reference: reference,
      description: description || "Deposit to wallet",
      currency: "USD",
      source: "@WorldUSD",
      destination: balanceId,
      allow_overdraft: true,
      meta_data: {
        transaction_type: "deposit",
        channel: "bank_transfer"
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error processing deposit:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Error processing deposit'
    });
  }
} 