require('dotenv').config();
const axios = require('axios');

const openaiApiKey = process.env.OPENAI_API_KEY;

if (!openaiApiKey) {
  console.error('OpenAI API key is missing. Please check your .env file.');
  process.exit(1);
}

const openaiApiUrl = 'https://api.openai.com/v1/completions';
const prompt = 'Once upon a time';

const requestData = {
  model: 'text-davinci-003',
  prompt: prompt,
  max_tokens: 100,
  temperature: 0.7,
};

axios
  .post(openaiApiUrl, requestData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
  })
  .then((response) => {
    const completion = response.data.choices[0].text.trim();
    console.log(`Prompt: ${prompt}`);
    console.log(`Completion: ${completion}`);
  })
  .catch((error) => {
    console.error('Error communicating with OpenAI API:', error.message);
  });
