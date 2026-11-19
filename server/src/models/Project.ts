import mongoose, { Schema, type Document } from 'mongoose';

export interface IProject extends Document {
  id: string;
  name: string;
  img: string;
  role: string;
  date: string;
  techStack: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, trim: true },
    img: { type: String, default: '' },
    role: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    techStack: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
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

export const Project =
  mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema);
