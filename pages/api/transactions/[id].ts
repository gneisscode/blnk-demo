import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_BASE || 'http://localhost:5001';
const API_KEY = process.env.NEXT_PUBLIC_BLNK_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching transaction');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error fetching transaction:', error);
      return res.status(500).json({
        message: error.message || 'Error fetching transaction'
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error updating transaction');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      return res.status(500).json({
        message: error.message || 'Error updating transaction'
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error deleting transaction');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      return res.status(500).json({
        message: error.message || 'Error deleting transaction'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 