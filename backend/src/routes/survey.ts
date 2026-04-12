import { Router, Request, Response } from 'express';
import { getRequirements, getProfilingQuestions, submitSurvey } from '../services/surveyService';
import { ValidationError } from '../errors';

const router = Router();

router.get('/requirements', (_req: Request, res: Response) => {
  res.json(getRequirements());
});

router.get('/profiling', (_req: Request, res: Response) => {
  res.json(getProfilingQuestions());
});

router.post('/surveys', async (req: Request, res: Response) => {
  try {
    const result = await submitSurvey(req.body);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    console.error('Error processing survey:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
