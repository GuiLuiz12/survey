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
  companyName?: string;
  contactEmail?: string;
  profile: ICompanyProfile;
  answers: Record<string, number | null>;
}

export interface ISurveyContext {
  companyName?: string;
  contactEmail?: string;
  profile: ICompanyProfile;
}

export interface IRadarDataResponse {
  message: string;
  displayName: string;
  submissionReference: string;
  radarData: {
    categories: string[];
    scores: number[];
    coverage: number[];
  };
}
