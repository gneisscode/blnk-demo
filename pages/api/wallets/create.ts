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
    const { identityId, currency, walletType } = req.body;

    // Validate required fields
    if (!identityId || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Identity ID and currency are required'
      });
    }

    // Create wallet payload
    const payload = {
      ledger_id: process.env.BLNK_LEDGER_ID,
      identity_id: identityId,
      currency: currency,
      meta_data: {
        wallet_type: walletType || 'main',
        purpose: walletType === 'main' ? 'general' : 'card_payments',
        status: 'active'
      }
    };

    const response = await blnkApi.post('/ledger-balances', payload);

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error creating wallet:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Error creating wallet'
    });
  }
} 