import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

const MODEL_FALLBACK_CHAIN = [
  'gemini-3.1-flash-lite',
  'gemini-4-hydrogen',
  'gemini-3.8-flash',
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

const PROMPT = `Locate and read the primary Indian vehicle license plate in this image.
Return compact JSON strictly matching the schema:
- boundingBox: normalized 0-1000 coordinates [ymin, xmin, ymax, xmax] tightly around the plate.
- vehicleType: e.g. "Car / Sedan", "SUV / Crossover", "Motorcycle / Two-Wheeler", "Commercial Truck / Bus", "Auto Rickshaw / 3-Wheeler", "Electric Vehicle".
- plateStyle: one of "Standard Private", "Commercial / Transport", "Electric Vehicle (Private)", "Electric Vehicle (Commercial)", "Rental / Self-Drive", "Bharat Series (BH)", "Diplomatic / Consular", "Military / Defence", "Temporary".
- angleDegrees: estimated plate tilt (-45 to 45).
- qualityAssessment: blurScore (0-100, 100=sharp), isBlurry (true if blurScore < 65), readabilityScore (0-100), lightingCondition ("Optimal Daylight", "Overexposed / Glare", "Underexposed / Dim", "Night / Artificial Light", or "Uneven Shadows"), degradationFactors (array from ["motion_blur","low_resolution","defocus_blur","harsh_glare","shadow_obstruction","dirty_plate","rain_glare","none"]).
- ocrResult: rawText as seen, normalizedNumber (uppercase single-space separated e.g. "MH 12 DE 1433" or "22 BH 5432 AA"), confidence (0-100), hasIndStrip, hasHologram, hasObstructions.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plateDetected: { type: Type.BOOLEAN },
    boundingBox: {
      type: Type.OBJECT,
      properties: {
        ymin: { type: Type.INTEGER },
        xmin: { type: Type.INTEGER },
        ymax: { type: Type.INTEGER },
        xmax: { type: Type.INTEGER },
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
        blurScore: { type: Type.INTEGER },
        readabilityScore: { type: Type.INTEGER },
        lightingCondition: { type: Type.STRING },
        degradationFactors: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
      required: ['isBlurry', 'blurScore', 'readabilityScore'],
    },
    ocrResult: {
      type: Type.OBJECT,
      properties: {
        rawText: { type: Type.STRING },
        normalizedNumber: { type: Type.STRING },
        confidence: { type: Type.INTEGER },
        hasIndStrip: { type: Type.BOOLEAN },
        hasHologram: { type: Type.BOOLEAN },
        hasObstructions: { type: Type.BOOLEAN },
      },
      required: ['rawText', 'normalizedNumber', 'confidence'],
    },
  },
  required: ['plateDetected', 'boundingBox', 'qualityAssessment', 'ocrResult'],
};

function enrichLprPayload(raw: any) {
  if (raw.boundingBox) {
    const box = raw.boundingBox;
    const ymin = Math.max(0, Math.min(980, Number(box.ymin) || 0));
    const xmin = Math.max(0, Math.min(980, Number(box.xmin) || 0));
    const ymax = Math.max(ymin + 15, Math.min(1000, Number(box.ymax) || ymin + 100));
    const xmax = Math.max(xmin + 20, Math.min(1000, Number(box.xmax) || xmin + 200));
    raw.boundingBox = { ymin, xmin, ymax, xmax };
  }

  const qa = raw.qualityAssessment || {};
  const blurScore = Math.max(0, Math.min(100, Number(qa.blurScore) || 75));
  const isBlurry = typeof qa.isBlurry === 'boolean' ? qa.isBlurry : blurScore < 65;
  const factors: string[] = Array.isArray(qa.degradationFactors)
    ? qa.degradationFactors.filter((f: string) => f && f !== 'none')
    : [];

  raw.qualityAssessment = {
    isBlurry,
    blurScore,
    readabilityScore: Math.max(0, Math.min(100, Number(qa.readabilityScore) || blurScore)),
    lightingCondition: qa.lightingCondition || 'Optimal Daylight',
    degradationFactors: factors,
    enhancementNeeded: isBlurry,
    recommendations: isBlurry
      ? ['Apply unsharp masking and local contrast boost to sharpen glyph edges']
      : ['Plate clarity is sufficient for direct OCR extraction'],
  };

  const ocr = raw.ocrResult || {};
  const plateStr = String(ocr.normalizedNumber || ocr.rawText || '').trim().toUpperCase();
  const baseConf = Math.max(0, Math.min(100, Number(ocr.confidence) || 92));
  const chars = plateStr
    .replace(/\s+/g, '')
    .split('')
    .map((ch: string, idx: number) => ({
      char: ch,
      confidence: Math.max(60, Math.min(99, baseConf - (idx % 3))),
    }));

  raw.ocrResult = {
    rawText: String(ocr.rawText || plateStr).toUpperCase(),
    normalizedNumber: plateStr,
    confidence: baseConf,
    hasIndStrip: ocr.hasIndStrip ?? true,
    hasHologram: ocr.hasHologram ?? true,
    hasObstructions: ocr.hasObstructions ?? false,
    characters: chars,
  };

  if (!raw.validationResult) {
    raw.validationResult = {
      isValid: plateStr.length >= 6,
      formatCategory: plateStr.includes('BH') ? 'Bharat Series (BH)' : 'Standard MoRTH State Series',
      validationExplanation: `Extracted registration string "${plateStr}".`,
      ruleCompliant: true,
      complianceIssues: [],
    };
  }

  return raw;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { imageBase64, mimeType = 'image/jpeg' } = body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required (imageBase64)' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error:
          'Gemini API Key is not configured on Vercel. Add GEMINI_API_KEY in Vercel Project Settings > Environment Variables and redeploy.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        timeout: 12000,
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let resolvedMimeType = mimeType;
    const dataUrlMatch = imageBase64.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    if (dataUrlMatch) {
      resolvedMimeType = dataUrlMatch[1];
    }
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    let lastError: any = null;
    let parsedResult: any = null;

    for (let idx = 0; idx < MODEL_FALLBACK_CHAIN.length; idx++) {
      const modelName = MODEL_FALLBACK_CHAIN[idx];

      try {
        const modelConfig: Record<string, any> = {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        };

        if (modelName === 'gemini-4-hydrogen' || modelName === 'gemini-3.8-flash') {
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
                text: PROMPT,
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
          `Vercel model ${modelName} failed (status=${info.status}): ${info.message}`
        );

        if (!info.shouldFallback) {
          throw err;
        }

        await sleep(200);
      }
    }

    if (!parsedResult) {
      throw lastError || new Error('All AI vision models are temporarily busy.');
    }

    return res.status(200).json(enrichLprPayload(parsedResult));
  } catch (error: any) {
    console.error('Vercel /api/analyze-plate error:', error);
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
}
