import mongoose, { Schema, type Document } from 'mongoose';

export interface IExperience extends Document {
  id: string;
  type: 'Education' | 'Work';
  company: string;
  subDescrip: string;
  date: string;
  descrip: string;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>(
  {
    type: {
      type: String,
      required: true,
      enum: ['Education', 'Work'],
    },
    company: { type: String, required: true, trim: true },
    subDescrip: { type: String, default: '', trim: true },
    date: { type: String, required: true, trim: true },
    descrip: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Experience =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', experienceSchema);
