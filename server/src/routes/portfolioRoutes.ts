import { Router, type Request, type Response } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Skill } from '../models/Skill.js';
import { Experience } from '../models/Experience.js';
import { Project } from '../models/Project.js';
import {
  listSkills,
  getSkill,
  createSkill,
  updateSkill,
  removeSkill,
} from '../controllers/skillController.js';
import {
  listExperiences,
  getExperience,
  createExperience,
  updateExperience,
  removeExperience,
} from '../controllers/experienceController.js';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  removeProject,
} from '../controllers/projectController.js';

export const portfolioRoutes = Router();

// GET /portfolio - Aggregated public data
portfolioRoutes.get(
  '/portfolio',
  asyncHandler(async (_req: Request, res: Response) => {
    const [skills, experiences, projects] = await Promise.all([
      Skill.find().sort({ createdAt: 1 }),
      Experience.find().sort({ createdAt: 1 }),
      Project.find().sort({ createdAt: 1 }),
    ]);
    res.json({ skills, experiences, projects });
  })
);

// Skills
portfolioRoutes.get('/skills', asyncHandler(listSkills));
portfolioRoutes.get('/skills/:id', asyncHandler(getSkill));
portfolioRoutes.post('/skills', requireAdmin, asyncHandler(createSkill));
portfolioRoutes.put('/skills/:id', requireAdmin, asyncHandler(updateSkill));
portfolioRoutes.delete('/skills/:id', requireAdmin, asyncHandler(removeSkill));

// Also support /portfolio/skills/:id aliases for backward compatibility
portfolioRoutes.get('/portfolio/skills', asyncHandler(listSkills));
portfolioRoutes.post('/portfolio/skills', requireAdmin, asyncHandler(createSkill));
portfolioRoutes.put('/portfolio/skills/:id', requireAdmin, asyncHandler(updateSkill));
portfolioRoutes.delete('/portfolio/skills/:id', requireAdmin, asyncHandler(removeSkill));

// Experiences
portfolioRoutes.get('/experiences', asyncHandler(listExperiences));
portfolioRoutes.get('/experiences/:id', asyncHandler(getExperience));
portfolioRoutes.post('/experiences', requireAdmin, asyncHandler(createExperience));
portfolioRoutes.put('/experiences/:id', requireAdmin, asyncHandler(updateExperience));
portfolioRoutes.delete('/experiences/:id', requireAdmin, asyncHandler(removeExperience));

// Also support /portfolio/experiences/:id aliases
portfolioRoutes.get('/portfolio/experiences', asyncHandler(listExperiences));
portfolioRoutes.post('/portfolio/experiences', requireAdmin, asyncHandler(createExperience));
portfolioRoutes.put('/portfolio/experiences/:id', requireAdmin, asyncHandler(updateExperience));
portfolioRoutes.delete('/portfolio/experiences/:id', requireAdmin, asyncHandler(removeExperience));

// Projects
portfolioRoutes.get('/projects', asyncHandler(listProjects));
portfolioRoutes.get('/projects/:id', asyncHandler(getProject));
portfolioRoutes.post('/projects', requireAdmin, asyncHandler(createProject));
portfolioRoutes.put('/projects/:id', requireAdmin, asyncHandler(updateProject));
portfolioRoutes.delete('/projects/:id', requireAdmin, asyncHandler(removeProject));

// Also support /portfolio/projects/:id aliases
portfolioRoutes.get('/portfolio/projects', asyncHandler(listProjects));
portfolioRoutes.post('/portfolio/projects', requireAdmin, asyncHandler(createProject));
portfolioRoutes.put('/portfolio/projects/:id', requireAdmin, asyncHandler(updateProject));
portfolioRoutes.delete('/portfolio/projects/:id', requireAdmin, asyncHandler(removeProject));
