import mongoose, { Schema, type Document } from 'mongoose';

export interface ISkill extends Document {
  id: string;
  skillName: string;
  focus: 'Software' | 'Hardware' | 'Data' | 'AI' | 'Web';
  img: string;
  descrip: string;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    skillName: { type: String, required: true, trim: true },
    focus: {
      type: String,
      required: true,
      enum: ['Software', 'Hardware', 'Data', 'AI', 'Web'],
    },
    img: { type: String, default: '' },
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

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', skillSchema);
