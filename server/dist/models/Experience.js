import mongoose, { Schema } from 'mongoose';
const experienceSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Education', 'Work'],
    },
    company: { type: String, required: true, trim: true },
    subDescrip: { type: String, default: '', trim: true },
    date: { type: String, required: true, trim: true },
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
export const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);
