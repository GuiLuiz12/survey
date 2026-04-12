import { requirementMapping, profilingQuestions } from '../data';
import { ISurveyPayload } from '../interfaces';
import { ValidationError } from '../errors';

export const CATEGORIES = ['PO', 'PS', 'PW', 'RV'] as const;

const profilingMap = new Map(profilingQuestions.map(q => [q.id, q]));

function validateProfile(payload: ISurveyPayload): void {
  const { profile } = payload;

  if (!profile || typeof profile !== 'object') {
    throw new ValidationError('profile is required.');
  }

  const expectedIds = profilingQuestions.map(q => q.id);
  const receivedKeys = Object.keys(profile);

  if (receivedKeys.length !== expectedIds.length) {
    throw new ValidationError(`Exactly ${expectedIds.length} profile answers are required. Received ${receivedKeys.length}.`);
  }

  for (const id of expectedIds) {
    if (!(id in profile)) {
      throw new ValidationError(`Missing profile answer for ${id}.`);
    }

    const question = profilingMap.get(id)!;
    const value = profile[id];

    if (question.multiSelect) {
      if (!Array.isArray(value) || value.length === 0) {
        throw new ValidationError(`${id} requires at least one selected option.`);
      }
      for (const v of value) {
        if (!question.options.includes(v)) {
          throw new ValidationError(`Invalid option for ${id}: "${v}".`);
        }
      }
    } else {
      if (typeof value !== 'string' || !question.options.includes(value)) {
        throw new ValidationError(`Invalid option for ${id}: "${value}".`);
      }
    }
  }
}

function validateAnswers(payload: ISurveyPayload): void {
  const { answers } = payload;

  if (!answers || typeof answers !== 'object') {
    throw new ValidationError('answers must be an object.');
  }

  const expectedKeys = Object.keys(requirementMapping);
  const receivedKeys = Object.keys(answers);

  if (receivedKeys.length !== 30) {
    throw new ValidationError(`Exactly 30 answers are required. Received ${receivedKeys.length}.`);
  }

  for (const key of expectedKeys) {
    if (!(key in answers)) {
      throw new ValidationError(`Missing answer for ${key}.`);
    }
    const value = answers[key];
    if (value !== null && (!Number.isInteger(value) || value < 0 || value > 5)) {
      throw new ValidationError(`Answer for ${key} must be an integer between 0 and 5, or null (N/A). Received ${value}.`);
    }
  }

  const scoredPerCategory: Record<string, number> = { PO: 0, PS: 0, PW: 0, RV: 0 };
  for (const [reqId, value] of Object.entries(answers)) {
    if (value !== null) {
      const cat = requirementMapping[reqId];
      if (cat) scoredPerCategory[cat]++;
    }
  }

  for (const cat of CATEGORIES) {
    if (scoredPerCategory[cat] === 0) {
      throw new ValidationError(`Category ${cat} must have at least 1 scored (non-N/A) requirement.`);
    }
  }
}

export function validateSurveyPayload(payload: ISurveyPayload): void {
  const { companyName } = payload;

  if (!companyName || typeof companyName !== 'string' || companyName.trim().length === 0) {
    throw new ValidationError('companyName is required.');
  }

  validateProfile(payload);
  validateAnswers(payload);
}
