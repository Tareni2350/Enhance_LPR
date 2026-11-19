export default function handler(req: any, res: any) {
  return res.status(200).json({
    status: 'ok',
    hasApiKey: !!(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
    timestamp: new Date().toISOString(),
  });
}
