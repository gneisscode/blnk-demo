import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_BLNK_API_URL || 'http://localhost:5001';
const API_KEY = process.env.BLNK_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: 'Identity ID is required',
      error: true
    });
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_BASE}/identities/${id}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || 'Error fetching identity',
          error: true
        });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error in identity details API route:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
        error: true
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const response = await fetch(`${API_BASE}/identities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          message: data.message || 'Error updating identity',
          error: true
        });
      }

      return res.status(200).json(data);
    } catch (error: any) {
      console.error('Error in identity update API route:', error);
      return res.status(500).json({
        message: error.message || 'Internal server error',
        error: true
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const response = await fetch(`${API_BASE}/identities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return res.status(response.status).json({
          message: data.message || 'Error deleting identity',
          error: true
        });
      }

      return res.status(204).end();
    } catch (error: any) {
      console.error('Error in identity delete API route:', error);
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