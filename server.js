import dotenv from 'dotenv';
import express from 'express';
import cohere from 'cohere-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Cohere with the API key
cohere.init(process.env.COHERE_API_KEY);

app.use(express.json()); // Middleware to parse JSON bodies

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// API route to generate text using Cohere
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await cohere.generate({
      model: 'command',
      prompt: prompt,
      max_tokens: 100,
    });

    const generatedText = response.body.generations[0].text;
    res.json({ generatedText });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
