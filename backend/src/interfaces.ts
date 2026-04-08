export interface IRequirement {
  id: string;
  question: string;
  expectedEvidence: string;
}

export interface ISurveyPayload {
  companyName: string;
  answers: Record<string, number>;
}

export interface IRadarDataResponse {
  message: string;
  radarData: {
    categories: string[];
    scores: number[];
  };
}
