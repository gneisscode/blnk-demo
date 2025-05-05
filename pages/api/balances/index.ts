import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const response = await fetch('http://localhost:5001/balances', {
          headers: {
            'Authorization': `Bearer ${process.env.API_KEY}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch balances');
        }

        const data = await response.json();
        res.status(200).json(data);
      } catch (error) {
        console.error('Error fetching balances:', error);
        res.status(500).json({ error: 'Failed to fetch balances' });
      }
      break;

    case 'POST':
      try {
        const response = await fetch('http://localhost:5001/balances', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_KEY}`,
          },
          body: JSON.stringify(req.body),
        });

        if (!response.ok) {
          throw new Error('Failed to create balance');
        }

        const data = await response.json();
        res.status(201).json(data);
      } catch (error) {
        console.error('Error creating balance:', error);
        res.status(500).json({ error: 'Failed to create balance' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
} 