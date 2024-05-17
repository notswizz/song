import axios from 'axios';

const url = 'https://chatgpt-42.p.rapidapi.com/gpt4';
const rapidApiKey = process.env.RAPIDAPI_KEY;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    const options = {
      method: 'POST',
      url: url,
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
      },
      data: {
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }
    };

    try {
      const response = await axios.request(options);
      // Log the entire response data for debugging
      console.log('API response:', response.data);
      res.status(200).json({ text: response.data.result });
    } catch (error) {
      console.error('Error generating song:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        res.status(error.response.status).json({ error: error.response.data });
      } else if (error.request) {
        console.error('Request data:', error.request);
        res.status(500).json({ error: 'No response received from the API' });
      } else {
        console.error('Error message:', error.message);
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}