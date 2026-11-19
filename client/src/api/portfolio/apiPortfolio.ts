import { api } from '../client';
import type { PortfolioData, Project, Skill, Experience } from '../../dataTypes/dataTypesPortfolio';

// Portfolio combined
export async function fetchPortfolioData(): Promise<{ data: PortfolioData | null; error: Error | null }> {
  try {
    const data = await api.get<PortfolioData>('/portfolio');
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

// Projects
export async function getProjects(): Promise<Project[]> {
  return api.get<Project[]>('/projects');
}

export async function createProjectApi(data: Omit<Project, 'id' | '_id'>): Promise<Project> {
  return api.post<Project>('/projects', data);
}

export async function updateProjectApi(id: string, data: Partial<Project>): Promise<Project> {
  return api.put<Project>(`/projects/${id}`, data);
}

export async function deleteProjectApi(id: string): Promise<{ success: boolean; message: string }> {
  return api.del<{ success: boolean; message: string }>(`/projects/${id}`);
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  return api.get<Skill[]>('/skills');
}

export async function createSkillApi(data: Omit<Skill, 'id' | '_id'>): Promise<Skill> {
  return api.post<Skill>('/skills', data);
}

export async function updateSkillApi(id: string, data: Partial<Skill>): Promise<Skill> {
  return api.put<Skill>(`/skills/${id}`, data);
}

export async function deleteSkillApi(id: string): Promise<{ success: boolean; message: string }> {
  return api.del<{ success: boolean; message: string }>(`/skills/${id}`);
}

// Experiences
export async function getExperiences(): Promise<Experience[]> {
  return api.get<Experience[]>('/experiences');
}

export async function createExperienceApi(data: Omit<Experience, 'id' | '_id'>): Promise<Experience> {
  return api.post<Experience>('/experiences', data);
}

export async function updateExperienceApi(id: string, data: Partial<Experience>): Promise<Experience> {
  return api.put<Experience>(`/experiences/${id}`, data);
}

export async function deleteExperienceApi(id: string): Promise<{ success: boolean; message: string }> {
  return api.del<{ success: boolean; message: string }>(`/experiences/${id}`);
}
