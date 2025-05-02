import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_URL || 'http://localhost:5001';
const API_KEY = process.env.BLNK_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${API_BASE}/ledgers/${id}`, {
      headers: {
        'Authorization': `Basic ${API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error fetching ledger details');
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching ledger details:', error);
    return res.status(500).json({
      message: error.message || 'Error fetching ledger details'
    });
  }
} 