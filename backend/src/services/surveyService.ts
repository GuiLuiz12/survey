import { requirementsList, requirementMapping, profilingQuestions } from '../data';
import { IRadarDataResponse, IRequirement, IProfilingQuestion, ISurveyPayload, CalculatedScores } from '../interfaces';
import { validateSurveyPayload, CATEGORIES } from '../validators/surveyValidator';
import Survey from '../models/Survey';
import Counter from '../models/Counter';

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

async function getNextReferenceNumber(): Promise<number> {
  const counter = await Counter.findByIdAndUpdate(
    'surveyReference',
    { $inc: { value: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (!counter) {
    throw new Error('Failed to allocate survey reference number.');
  }

  return counter.value;
}

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

  const referenceNumber = await getNextReferenceNumber();
  const submissionReference = formatSubmissionReference(referenceNumber);

  const survey = new Survey({
    companyName: normalizedCompanyName,
    contactEmail: normalizedContactEmail,
    referenceNumber,
    profile,
    rawAnswers: new Map(Object.entries(answers)),
    calculatedScores,
  });

  await survey.save();

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
