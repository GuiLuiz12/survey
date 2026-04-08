import mongoose, { Schema, Document } from 'mongoose';

export interface ISurvey extends Document {
  companyName: string;
  submittedAt: Date;
  rawAnswers: Map<string, number>;
  calculatedScores: {
    PO: number;
    PS: number;
    PW: number;
    RV: number;
  };
}

const SurveySchema: Schema = new Schema({
  companyName: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  rawAnswers: { type: Map, of: Number, required: true },
  calculatedScores: {
    PO: { type: Number, required: true },
    PS: { type: Number, required: true },
    PW: { type: Number, required: true },
    RV: { type: Number, required: true }
  }
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);
