import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Generous body limit for image uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Initialize Google GenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: 22000,
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set in environment. Gemini features will require key in Secrets.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

const MODEL_FALLBACK_CHAIN = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
] as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseApiError(error: any): {
  status: number;
  message: string;
  isTransient: boolean;
  shouldFallback: boolean;
} {
  const rawMessage = error?.message || String(error || 'Unknown error');
  let status = error?.status || error?.code || 500;
  let message = rawMessage;

  // Extract nested JSON error if the SDK wrapped it in error.message
  try {
    const jsonStart = rawMessage.indexOf('{');
    if (jsonStart !== -1) {
      const parsed = JSON.parse(rawMessage.slice(jsonStart));
      if (parsed?.error) {
        status = parsed.error.code || status;
        message = parsed.error.message || message;
      }
    }
  } catch {
    // Ignore JSON parse failure
  }

  const lower = `${rawMessage} ${message}`.toLowerCase();
  const isTransient =
    status === 503 ||
    status === 502 ||
    status === 504 ||
    status === 429 ||
    lower.includes('unavailable') ||
    lower.includes('high demand') ||
    lower.includes('overloaded') ||
    lower.includes('resource_exhausted') ||
    lower.includes('timeout') ||
    lower.includes('aborted') ||
    lower.includes('econnreset');

  const shouldFallback =
    isTransient ||
    status === 404 ||
    lower.includes('not found') ||
    lower.includes('not supported');

  return { status: Number(status) || 500, message, isTransient, shouldFallback };
}

/**
 * Main License Plate Analysis Endpoint
 * Takes base64 image and processes through full LPR pipeline:
 * 1. Bounding box localization [ymin, xmin, ymax, xmax] (0-1000)
 * 2. Blurriness and optical quality assessment
 * 3. Character recognition (OCR)
 * 4. Indian MoRTH/CMVR format validation
 */
app.post('/api/analyze-plate', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required (imageBase64)' });
    }

    if (!ai) {
      const currentKey = process.env.GEMINI_API_KEY;
      if (currentKey) {
        ai = new GoogleGenAI({
          apiKey: currentKey,
          httpOptions: {
            timeout: 22000,
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      } else {
        return res.status(500).json({
          error: 'Gemini API Key is not configured on the server. Please ensure GEMINI_API_KEY is set in Settings > Secrets.',
        });
      }
    }

    // Extract actual mimeType if embedded in data URL, and clean base64 string
    let resolvedMimeType = mimeType;
    const dataUrlMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    if (dataUrlMatch) {
      resolvedMimeType = dataUrlMatch[1];
    }
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    const prompt = `You are EnhanceLPR, an expert Computer Vision & Automated License Plate Recognition (ALPR) engine specialized in Indian vehicle registration plates (HSRP - High Security Registration Plates and legacy standard plates).

Analyze the provided vehicle image with extreme precision and perform the following 4-step pipeline:

1. PLATE LOCALIZATION & BOUNDING BOX:
- Locate the primary vehicle license plate (number plate).
- Provide normalized bounding box coordinates in 0-1000 scale: [ymin, xmin, ymax, xmax] where (0,0) is top-left and (1000,1000) is bottom-right.
- Detect vehicle type (e.g., "Car / Sedan", "SUV / Crossover", "Motorcycle / Two-Wheeler", "Commercial Truck / Bus", "Auto Rickshaw / 3-Wheeler", "Electric Vehicle", or "Other").
- Identify plate color style:
  * "Standard Private" (White background, Black characters)
  * "Commercial / Transport" (Yellow background, Black characters)
  * "Electric Vehicle (Private)" (Green background, White characters)
  * "Electric Vehicle (Commercial)" (Green background, Yellow characters)
  * "Rental / Self-Drive" (Black background, Yellow characters)
  * "Bharat Series (BH)" (White background, Black characters, BH format)
  * "Diplomatic / Consular" (Blue background, White characters)
  * "Military / Defence" (Black background with upward arrow)
  * "Temporary" (Yellow/Red background with Red/Black characters)
- Estimate plate angle/tilt in degrees (-45 to +45 deg).

2. BLUR & RESOLUTION QUALITY ASSESSMENT:
- Determine if the cropped plate region is blurry or degraded.
- Calculate blurScore: 0 to 100 (where 100 is razor sharp, 80-100 is high quality, 55-79 is moderate, <55 is blurry/needs enhancement).
- isBlurry: true if blurScore < 65 or if motion/focus/resolution blur makes characters hard to read.
- Identify specific blur or degradation causes: e.g., ["motion_blur", "low_resolution", "defocus_blur", "compression_artifacts", "harsh_glare", "shadow_obstruction", "dirty_plate", "none"].
- Lighting condition: "Optimal Daylight", "Overexposed / Glare", "Underexposed / Dim", "Night / Artificial Light", or "Uneven Shadows".
- Readability score: 0 to 100.

3. OPTICAL CHARACTER RECOGNITION (OCR):
- Extract the raw recognized text string exactly as shown on the plate (e.g., "MH 12 DE 1433" or "22 BH 5432 AA" or "DL 1C 9081").
- Normalize the plate number: standard uppercase letters and numbers separated by clean single spaces between sections (e.g., "MH 12 DE 1433").
- Extract the exact character breakdown with confidence scores (0-100) for each character.
- Check if "IND" blue country band is present on the left.
- Check if Ashok Chakra chromium hologram is visible.
- Check if any security rivets/screws obstruct any digits.
- Confidence: Overall OCR confidence (0 to 100).

4. INDIAN MoRTH / CMVR FORMAT VALIDATION:
Check the normalized plate number against standard Indian registration rules:
- State/UT code: 2 letters (e.g. MH, DL, KA, TN, GJ, UP, KL, TS, AP, HR, RJ, WB, etc.) OR "BH" for Bharat Series.
- District RTO code: 2 digits (e.g. 01 to 99).
- Series letters: 0 to 3 letters (e.g. AB, DE, C, EV, etc.).
- Unique Registration Number: 4 digits (e.g. 1433, 0001 to 9999).
- Bharat Series format: [YY] BH [4-digit number] [1-2 letters] (e.g. "22 BH 5432 AA").
- isValid: true if it strictly matches one of the valid Indian formats, false if invalid or unrecognized.
- formatCategory: "Standard MoRTH State Series", "Bharat Series (BH)", "Vintage / Pre-1989", "Diplomatic", "Military", or "Non-Standard / Invalid".
- stateName: Full name of State / Union Territory (e.g. "Maharashtra", "Delhi", "Karnataka", "Pan-India (BH Series)").
- districtRTO: District or RTO office name if recognizable (e.g. "Pune Central", "New Delhi Mall Road", "Bengaluru Central", etc.).
- validationExplanation: Clear concise 1-2 sentence explanation of why it is valid or what component failed the standard format.
- issues: Array of formatting or optical issues noticed (e.g., ["Slight motion blur compensated", "HSRP hologram detected"]).

Return your response strictly adhering to the requested JSON schema.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        plateDetected: {
          type: Type.BOOLEAN,
          description: 'Whether a vehicle license plate was successfully detected.',
        },
        boundingBox: {
          type: Type.OBJECT,
          properties: {
            ymin: { type: Type.INTEGER, description: 'Top edge normalized 0-1000' },
            xmin: { type: Type.INTEGER, description: 'Left edge normalized 0-1000' },
            ymax: { type: Type.INTEGER, description: 'Bottom edge normalized 0-1000' },
            xmax: { type: Type.INTEGER, description: 'Right edge normalized 0-1000' },
          },
          required: ['ymin', 'xmin', 'ymax', 'xmax'],
        },
        vehicleType: { type: Type.STRING },
        plateStyle: { type: Type.STRING },
        angleDegrees: { type: Type.NUMBER },
        qualityAssessment: {
          type: Type.OBJECT,
          properties: {
            isBlurry: { type: Type.BOOLEAN },
            blurScore: { type: Type.INTEGER, description: '0 to 100 (100 = crystal clear)' },
            readabilityScore: { type: Type.INTEGER, description: '0 to 100' },
            lightingCondition: { type: Type.STRING },
            degradationFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            enhancementNeeded: { type: Type.BOOLEAN },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['isBlurry', 'blurScore', 'readabilityScore', 'enhancementNeeded'],
        },
        ocrResult: {
          type: Type.OBJECT,
          properties: {
            rawText: { type: Type.STRING },
            normalizedNumber: { type: Type.STRING },
            confidence: { type: Type.INTEGER, description: '0 to 100' },
            hasIndStrip: { type: Type.BOOLEAN },
            hasHologram: { type: Type.BOOLEAN },
            hasObstructions: { type: Type.BOOLEAN },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  char: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                },
                required: ['char', 'confidence'],
              },
            },
          },
          required: ['rawText', 'normalizedNumber', 'confidence'],
        },
        validationResult: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            formatCategory: { type: Type.STRING },
            stateCode: { type: Type.STRING },
            stateName: { type: Type.STRING },
            rtoCode: { type: Type.STRING },
            districtRTO: { type: Type.STRING },
            series: { type: Type.STRING },
            uniqueDigits: { type: Type.STRING },
            validationExplanation: { type: Type.STRING },
            ruleCompliant: { type: Type.BOOLEAN },
            complianceIssues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['isValid', 'formatCategory', 'validationExplanation'],
        },
      },
      required: ['plateDetected', 'boundingBox', 'qualityAssessment', 'ocrResult', 'validationResult'],
    };

    let lastError: any = null;
    let parsedResult: any = null;

    for (let idx = 0; idx < MODEL_FALLBACK_CHAIN.length; idx++) {
      const modelName = MODEL_FALLBACK_CHAIN[idx];
      const maxAttemptsForModel = idx === MODEL_FALLBACK_CHAIN.length - 1 ? 2 : 1;

      for (let attempt = 1; attempt <= maxAttemptsForModel; attempt++) {
        try {
          const modelConfig: Record<string, any> = {
            responseMimeType: 'application/json',
            responseSchema,
          };

          if (modelName === 'gemini-3.8-flash') {
            modelConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: resolvedMimeType,
                    data: cleanBase64,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
            config: modelConfig,
          });

          const resultText = response.text;
          if (!resultText) {
            throw new Error('Empty response from AI vision model');
          }

          parsedResult = JSON.parse(resultText);
          break;
        } catch (err: any) {
          lastError = err;
          const info = parseApiError(err);
          console.warn(
            `Model ${modelName} attempt ${attempt}/${maxAttemptsForModel} failed (status=${info.status}, transient=${info.isTransient}): ${info.message}`
          );

          if (!info.shouldFallback) {
            throw err;
          }

          if (info.status === 404) {
            break; // Immediately move to next model in chain
          }

          await sleep(400 * attempt);
        }
      }

      if (parsedResult) {
        break;
      }
    }

    if (!parsedResult) {
      throw lastError || new Error('All AI vision models are temporarily busy.');
    }

    // Sanitize boundingBox coordinates safely to [0, 1000]
    if (parsedResult.boundingBox) {
      const box = parsedResult.boundingBox;
      const ymin = Math.max(0, Math.min(980, Number(box.ymin) || 0));
      const xmin = Math.max(0, Math.min(980, Number(box.xmin) || 0));
      const ymax = Math.max(ymin + 15, Math.min(1000, Number(box.ymax) || ymin + 100));
      const xmax = Math.max(xmin + 20, Math.min(1000, Number(box.xmax) || xmin + 200));
      parsedResult.boundingBox = { ymin, xmin, ymax, xmax };
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('Error analyzing license plate:', error);
    const parsedError = parseApiError(error);
    const statusCode = parsedError.status >= 400 && parsedError.status < 600 ? parsedError.status : 500;
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
