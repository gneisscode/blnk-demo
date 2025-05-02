import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_URL || 'http://localhost:5001';
const API_KEY = process.env.BLNK_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching transactions');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      return res.status(500).json({
        message: error.message || 'Error fetching transactions'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating transaction');
      }

      return res.status(201).json(data);
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      return res.status(500).json({
        message: error.message || 'Error creating transaction'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 