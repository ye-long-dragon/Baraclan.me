import type { Request, Response } from 'express';
import { Skill } from '../models/Skill.js';
import { skillSchema } from '../utils/validators.js';
import { HttpError } from '../utils/httpError.js';

export async function listSkills(_req: Request, res: Response): Promise<void> {
  const skills = await Skill.find().sort({ createdAt: 1 });
  res.json(skills);
}

export async function getSkill(req: Request, res: Response): Promise<void> {
  const skill = await Skill.findById(req.params.id);
  if (!skill) {
    throw new HttpError(404, 'Skill not found');
  }
  res.json(skill);
}

export async function createSkill(req: Request, res: Response): Promise<void> {
  const data = skillSchema.parse(req.body);
  const created = await Skill.create(data);
  res.status(201).json(created);
}

export async function updateSkill(req: Request, res: Response): Promise<void> {
  const data = skillSchema.parse(req.body);
  const updated = await Skill.findByIdAndUpdate(req.params.id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!updated) {
    throw new HttpError(404, 'Skill not found');
  }
  res.json(updated);
}

export async function removeSkill(req: Request, res: Response): Promise<void> {
  const removed = await Skill.findByIdAndDelete(req.params.id);
  if (!removed) {
    throw new HttpError(404, 'Skill not found');
  }
  res.json({ success: true, message: 'Skill deleted' });
}
