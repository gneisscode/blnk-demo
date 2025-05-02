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
    const { firstName, lastName, email, phone, customerId } = req.body;

    const response = await blnkApi.post('/identities', {
      identity_type: "individual",
      first_name: firstName,
      last_name: lastName,
      email_address: email,
      phone_number: phone,
      meta_data: {
        customer_id: customerId,
        registration_date: new Date().toISOString()
      }
    });

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    console.error('Error creating identity:', error);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Error creating identity'
    });
  }
} 