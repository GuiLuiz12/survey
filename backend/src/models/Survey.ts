import mongoose, { Schema, Document } from 'mongoose';
import { ICompanyProfile } from '../interfaces';

export interface ISurvey extends Document {
  companyName?: string;
  contactEmail?: string;
  referenceNumber: number;
  submittedAt: Date;
  profile: ICompanyProfile;
  rawAnswers: Map<string, number | null>;
  calculatedScores: {
    PO: number;
    PS: number;
    PW: number;
    RV: number;
  };
}

const SurveySchema: Schema = new Schema({
  companyName: { type: String, trim: true },
  contactEmail: { type: String, trim: true, lowercase: true },
  referenceNumber: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  profile: { type: Schema.Types.Mixed, required: true },
  rawAnswers: { type: Map, of: Schema.Types.Mixed, required: true },
  calculatedScores: {
    PO: { type: Number, required: true },
    PS: { type: Number, required: true },
    PW: { type: Number, required: true },
    RV: { type: Number, required: true }
  }
});

SurveySchema.index(
  { referenceNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { referenceNumber: { $exists: true } },
  }
);

export default mongoose.model<ISurvey>('Survey', SurveySchema);
