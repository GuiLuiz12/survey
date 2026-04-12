export interface IRequirement {
  id: string;
  category: string;
  question: string;
  expectedEvidence: string;
}

export interface IProfilingQuestion {
  id: string;
  question: string;
  options: string[];
  multiSelect: boolean;
}

export interface ICompanyProfile {
  [key: string]: string | string[];
}

export interface ISurveyPayload {
  companyName: string;
  profile: ICompanyProfile;
  answers: Record<string, number | null>;
}

export interface CalculatedScores {
  PO: number;
  PS: number;
  PW: number;
  RV: number;
}

export interface IRadarDataResponse {
  message: string;
  radarData: {
    categories: string[];
    scores: number[];
    coverage: number[];
  };
}
