import { randomInt } from 'node:crypto';
import { requirementsList, requirementMapping, profilingQuestions } from '../data';
import { IRadarDataResponse, IRequirement, IProfilingQuestion, ISurveyPayload, CalculatedScores } from '../interfaces';
import { validateSurveyPayload, CATEGORIES } from '../validators/surveyValidator';
import Survey from '../models/Survey';

const categorySize: Record<string, number> = {};
for (const cat of Object.values(requirementMapping)) {
  categorySize[cat] = (categorySize[cat] || 0) + 1;
}

export function getRequirements(): IRequirement[] {
  return requirementsList;
}

export function getProfilingQuestions(): IProfilingQuestion[] {
  return profilingQuestions;
}

function normalizeOptionalText(value?: string): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function formatSubmissionReference(referenceNumber: number): string {
  return `SDLC-${String(referenceNumber).padStart(6, '0')}`;
}

function generateSixDigitReference(): number {
  return randomInt(100_000, 1_000_000);
}

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000;
}

const MAX_REFERENCE_ATTEMPTS = 20;

export async function submitSurvey(payload: ISurveyPayload): Promise<IRadarDataResponse> {
  validateSurveyPayload(payload);

  const normalizedCompanyName = normalizeOptionalText(payload.companyName);
  const normalizedContactEmail = normalizeOptionalText(payload.contactEmail)?.toLowerCase();
  const { profile, answers } = payload;

  const categoryScores: Record<string, number[]> = { PO: [], PS: [], PW: [], RV: [] };

  for (const [reqId, score] of Object.entries(answers)) {
    if (score === null) continue;
    const category = requirementMapping[reqId];
    if (category) {
      categoryScores[category].push(score);
    }
  }

  const round1 = (n: number) => Math.round(n * 10) / 10;

  const calculatedScores = {} as CalculatedScores;
  const coverageValues: number[] = [];

  for (const cat of CATEGORIES) {
    const scored = categoryScores[cat];
    const total = categorySize[cat];
    const rawAvg = scored.reduce((a, b) => a + b, 0) / scored.length;
    const coverage = scored.length / total;
    calculatedScores[cat] = round1(rawAvg * coverage);
    coverageValues.push(round1(coverage));
  }

  let referenceNumber = 0;
  let submissionReference = '';

  for (let attempt = 0; attempt < MAX_REFERENCE_ATTEMPTS; attempt++) {
    referenceNumber = generateSixDigitReference();
    submissionReference = formatSubmissionReference(referenceNumber);

    const survey = new Survey({
      companyName: normalizedCompanyName,
      contactEmail: normalizedContactEmail,
      referenceNumber,
      profile,
      rawAnswers: new Map(Object.entries(answers)),
      calculatedScores,
    });

    try {
      await survey.save();
      break;
    } catch (err) {
      if (isDuplicateKeyError(err) && attempt < MAX_REFERENCE_ATTEMPTS - 1) {
        continue;
      }
      if (isDuplicateKeyError(err)) {
        throw new Error('Failed to allocate unique survey reference number.');
      }
      throw err;
    }
  }

  return {
    message: 'Survey submitted successfully.',
    displayName: normalizedCompanyName ?? 'Empresa não identificada',
    submissionReference,
    radarData: {
      categories: [...CATEGORIES],
      scores: CATEGORIES.map(c => calculatedScores[c]),
      coverage: coverageValues,
    },
  };
}
