import mongoose, { Schema } from 'mongoose';
const projectSchema = new Schema({
    name: { type: String, required: true, trim: true },
    img: { type: String, default: '' },
    role: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    techStack: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            ret.id = String(ret._id);
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});
export const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
