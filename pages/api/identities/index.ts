import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_URL || 'http://localhost:5001';
const API_KEY = process.env.BLNK_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE}/identities`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || 'Error fetching identities',
          error: true
        });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error in identities API route:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
        error: true
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const response = await fetch(`${API_BASE}/identities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || 'Error creating identity',
          error: true
        });
      }

      return res.status(201).json(data);
    } catch (error: any) {
      console.error('Error in identities API route:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
        error: true
      });
    }
  }

  return res.status(405).json({
    message: 'Method not allowed',
    error: true
  });
} 