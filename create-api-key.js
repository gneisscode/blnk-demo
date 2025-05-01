const axios = require('axios');

async function createApiKey() {
  try {
    const response = await axios.post('http://localhost:5001/api-keys', {
      name: 'demo-key',
      owner: 'demo-owner',
      scopes: [
        'ledgers:read',
        'ledgers:write',
        'balances:read',
        'balances:write',
        'transactions:read',
        'transactions:write'
      ],
      expires_at: '2026-03-11T00:00:00Z'
    }, {
      headers: {
        'X-Blnk-Key': 'blnk_demo_secret_key_2024',
        'Content-Type': 'application/json'
      }
    });

    console.log('API Key created successfully:');
    console.log('API Key:', response.data.key);
    console.log('API Key ID:', response.data.api_key_id);
    console.log('\nSave this API key securely! You will need it for all API requests.');
  } catch (error) {
    console.error('Error creating API key:', error.response?.data || error.message);
  }
}

createApiKey(); 