import { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

function buildJsonLimiter(windowMs: number, max: number) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({ error: 'Muitas tentativas. Tente novamente em instantes.' });
    },
  });
}

export const readLimiter = buildJsonLimiter(15 * 60 * 1000, 200);
export const surveySubmitLimiter = buildJsonLimiter(15 * 60 * 1000, 5);
