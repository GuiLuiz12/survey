import axios from 'axios';
import type { IRequirement, ISurveyPayload, IRadarDataResponse } from '../types';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export async function getRequirements(): Promise<IRequirement[]> {
  const { data } = await client.get<IRequirement[]>('/api/requirements');
  return data;
}

export async function submitSurvey(payload: ISurveyPayload): Promise<IRadarDataResponse> {
  const { data } = await client.post<IRadarDataResponse>('/api/surveys', payload);
  return data;
}
