import mongoose, { Schema } from 'mongoose';
const skillSchema = new Schema({
    skillName: { type: String, required: true, trim: true },
    focus: {
        type: String,
        required: true,
        enum: ['Software', 'Hardware', 'Data', 'AI', 'Web'],
    },
    img: { type: String, default: '' },
    descrip: { type: String, required: true, trim: true },
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
export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema);
