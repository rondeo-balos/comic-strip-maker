import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateComicStrip } from './generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads (store in memory)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
});

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

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

app.post('/api/generate-with-uploads', upload.array('images', 20), async (req, res) => {
  try {
    // Parse the comic structure from form data
    const comicData = JSON.parse(req.body.comicData);
    
    // Validate input
    if (!comicData.rows || !Array.isArray(comicData.rows)) {
      return res.status(400).json({ error: 'Invalid payload: rows array required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Convert uploaded files to base64 data URIs
    const imageMap = {};
    req.files.forEach((file, index) => {
      const base64 = file.buffer.toString('base64');
      const mimeType = file.mimetype;
      imageMap[`image${index}`] = `data:${mimeType};base64,${base64}`;
    });

    // Replace image placeholders with base64 data URIs
    comicData.rows.forEach(row => {
      row.panels.forEach(panel => {
        // If image is a placeholder like "image0", "image1", replace it
        if (panel.image && panel.image.startsWith('image') && imageMap[panel.image]) {
          panel.image = imageMap[panel.image];
        }
      });
    });

    const imageBuffer = await generateComicStrip(comicData);
    
    res.set('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error generating comic with uploads:', error);
    res.status(500).json({ error: 'Failed to generate comic strip', details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Comic Strip Maker API running on port ${PORT}`);
});
