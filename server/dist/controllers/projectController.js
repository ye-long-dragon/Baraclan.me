import { Project } from '../models/Project.js';
import { projectSchema } from '../utils/validators.js';
import { HttpError } from '../utils/httpError.js';
export async function listProjects(_req, res) {
    const projects = await Project.find().sort({ createdAt: 1 });
    res.json(projects);
}
export async function getProject(req, res) {
    const project = await Project.findById(req.params.id);
    if (!project) {
        throw new HttpError(404, 'Project not found');
    }
    res.json(project);
}
export async function createProject(req, res) {
    const data = projectSchema.parse(req.body);
    const created = await Project.create(data);
    res.status(201).json(created);
}
export async function updateProject(req, res) {
    const data = projectSchema.parse(req.body);
    const updated = await Project.findByIdAndUpdate(req.params.id, data, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!updated) {
        throw new HttpError(404, 'Project not found');
    }
    res.json(updated);
}
export async function removeProject(req, res) {
    const removed = await Project.findByIdAndDelete(req.params.id);
    if (!removed) {
        throw new HttpError(404, 'Project not found');
    }
    res.json({ success: true, message: 'Project deleted' });
}
