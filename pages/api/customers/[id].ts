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
      const response = await fetch(`${API_BASE}/customers/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error fetching customer');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error fetching customer:', error);
      return res.status(500).json({
        message: error.message || 'Error fetching customer'
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const response = await fetch(`${API_BASE}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        },
        body: JSON.stringify(req.body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error updating customer');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error updating customer:', error);
      return res.status(500).json({
        message: error.message || 'Error updating customer'
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const response = await fetch(`${API_BASE}/customers/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Blnk-Key': API_KEY || ''
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error deleting customer');
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      return res.status(500).json({
        message: error.message || 'Error deleting customer'
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 