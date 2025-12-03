import express from 'express';
import { generateComicStrip } from './generator.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));

app.post('/api/generate', async (req, res) => {
  try {
    const comicData = req.body;
    
    // Validate input
    if (!comicData.rows || !Array.isArray(comicData.rows)) {
      return res.status(400).json({ error: 'Invalid payload: rows array required' });
    }

    const imageBuffer = await generateComicStrip(comicData);
    
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating comic:', error);
    res.status(500).json({ error: 'Failed to generate comic strip', details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Comic Strip Maker API running on port ${PORT}`);
});
