import { Experience } from '../models/Experience.js';
import { experienceSchema } from '../utils/validators.js';
import { HttpError } from '../utils/httpError.js';
export async function listExperiences(_req, res) {
    const experiences = await Experience.find().sort({ createdAt: 1 });
    res.json(experiences);
}
export async function getExperience(req, res) {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw new HttpError(404, 'Experience not found');
    }
    res.json(experience);
}
export async function createExperience(req, res) {
    const data = experienceSchema.parse(req.body);
    const created = await Experience.create(data);
    res.status(201).json(created);
}
export async function updateExperience(req, res) {
    const data = experienceSchema.parse(req.body);
    const updated = await Experience.findByIdAndUpdate(req.params.id, data, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!updated) {
        throw new HttpError(404, 'Experience not found');
    }
    res.json(updated);
}
export async function removeExperience(req, res) {
    const removed = await Experience.findByIdAndDelete(req.params.id);
    if (!removed) {
        throw new HttpError(404, 'Experience not found');
    }
    res.json({ success: true, message: 'Experience deleted' });
}
