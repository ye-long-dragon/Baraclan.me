import {
    createSkill,
    updateSkill,
    deleteSkill,
    createExperience,
    updateExperience,
    deleteExperience,
    createProject,
    updateProject,
    deleteProject,
} from '../portfolio/apiPortfolio';

// Bundles each entity's API calls in the shape useCrudModal expects.
export const skillApi = { create: createSkill, update: updateSkill, remove: deleteSkill };
export const projectApi = { create: createProject, update: updateProject, remove: deleteProject };
export const experienceApi = {
    create: createExperience,
    update: updateExperience,
    remove: deleteExperience,
};
