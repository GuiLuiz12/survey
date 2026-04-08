import { Router, Request, Response } from 'express';
import { requirementsList, requirementMapping } from '../data';
import { ISurveyPayload, IRadarDataResponse } from '../interfaces';
import Survey from '../models/Survey';

const router = Router();

router.get('/requirements', (_req: Request, res: Response) => {
  res.json(requirementsList);
});

router.post('/surveys', async (req: Request, res: Response) => {
  try {
    const { companyName, answers } = req.body as ISurveyPayload;

    if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
      res.status(400).json({ error: 'companyName is required.' });
      return;
    }

    if (!answers || typeof answers !== 'object') {
      res.status(400).json({ error: 'answers must be an object.' });
      return;
    }

    const expectedKeys = Object.keys(requirementMapping);
    const receivedKeys = Object.keys(answers);

    if (receivedKeys.length !== 30) {
      res.status(400).json({ error: `Exactly 30 answers are required. Received ${receivedKeys.length}.` });
      return;
    }

    for (const key of expectedKeys) {
      if (!(key in answers)) {
        res.status(400).json({ error: `Missing answer for ${key}.` });
        return;
      }
      const value = answers[key];
      if (!Number.isInteger(value) || value < 0 || value > 5) {
        res.status(400).json({ error: `Answer for ${key} must be an integer between 0 and 5. Received ${value}.` });
        return;
      }
    }

    const categoryTotals: Record<string, number[]> = { PO: [], PS: [], PW: [], RV: [] };

    for (const [reqId, score] of Object.entries(answers)) {
      const category = requirementMapping[reqId];
      if (category) {
        categoryTotals[category].push(score);
      }
    }

    const avg = (arr: number[]) => Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

    const calculatedScores = {
      PO: avg(categoryTotals.PO),
      PS: avg(categoryTotals.PS),
      PW: avg(categoryTotals.PW),
      RV: avg(categoryTotals.RV)
    };

    const survey = new Survey({
      companyName: companyName.trim(),
      rawAnswers: new Map(Object.entries(answers)),
      calculatedScores
    });

    await survey.save();

    const response: IRadarDataResponse = {
      message: 'Survey submitted successfully.',
      radarData: {
        categories: ['PO', 'PS', 'PW', 'RV'],
        scores: [calculatedScores.PO, calculatedScores.PS, calculatedScores.PW, calculatedScores.RV]
      }
    };

    res.status(201).json(response);
  } catch (err) {
    console.error('Error processing survey:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
