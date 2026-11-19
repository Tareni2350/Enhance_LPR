import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { analyzePlateImage, parseApiError } from './lib/lprEngine';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Generous body limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Main License Plate Analysis Endpoint
 * Delegates to shared LPR engine used by both Express and Vercel Serverless Functions.
 */
app.post('/api/analyze-plate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required (imageBase64)' });
    }

    const parsedResult = await analyzePlateImage(imageBase64, mimeType);
    return res.json(parsedResult);
  } catch (error: any) {
    console.error('Error analyzing license plate:', error);
    const parsedError = parseApiError(error);
    const statusCode =
      parsedError.status >= 400 && parsedError.status < 600 ? parsedError.status : 500;
    const friendlyMessage = parsedError.isTransient
      ? 'The AI vision service is temporarily busy due to high demand. Please click Retry in a moment.'
      : parsedError.message || 'Failed to analyze vehicle license plate.';

    return res.status(statusCode).json({
      error: friendlyMessage,
      code: parsedError.status,
      isTransient: parsedError.isTransient,
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EnhanceLPR server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
