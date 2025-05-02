import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_BASE || 'http://localhost:5001';
const API_KEY = process.env.NEXT_PUBLIC_BLNK_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching ledgers from:', `${API_BASE}/ledgers`);
      const response = await fetch(`${API_BASE}/ledgers`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching ledgers');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error fetching ledgers:', {
        message: error.message,
        baseURL: API_BASE,
        hasApiKey: !!API_KEY
      });
      return res.status(500).json({
        message: error.message || 'Error fetching ledgers'
      });
    }
  }

  if (req.method === 'POST') {
    try {
      console.log('Creating ledger with data:', req.body);
      const response = await fetch(`${API_BASE}/ledgers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating ledger');
      }

      return res.status(201).json(data);
    } catch (error: any) {
      console.error('Error creating ledger:', {
        message: error.message,
        baseURL: API_BASE,
        hasApiKey: !!API_KEY
      });
      return res.status(500).json({
        message: error.message || 'Error creating ledger'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 