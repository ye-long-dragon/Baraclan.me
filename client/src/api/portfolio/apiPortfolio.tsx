import type { Skill, Experience, Project, PortfolioData } from '../../dataTypes/dataTypesPortfolio';
import {
  skills as initialSkills,
  experiences as initialExperiences,
  projects as initialProjects,
} from '../../features/portfolio/data/portfolioData';

const API_BASE = '/api/portfolio';
const STORAGE_KEY = 'baraclan_portfolio_cache';

// Helper to manage local fallback storage
function getLocalPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading local portfolio cache:', err);
  }

  // Initial fallback data with generated IDs
  const initial: PortfolioData = {
    skills: initialSkills.map((s, idx) => ({ ...s, _id: s._id || `skl_${idx + 1}` })),
    experiences: initialExperiences.map((e, idx) => ({ ...e, _id: e._id || `exp_${idx + 1}` })),
    projects: initialProjects.map((p, idx) => ({ ...p, _id: p._id || `prj_${idx + 1}` })),
  };
  saveLocalPortfolio(initial);
  return initial;
}

function saveLocalPortfolio(data: PortfolioData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving local portfolio cache:', err);
  }
}

// -------------------------------------------------------------
// READ ALL PORTFOLIO DATA (Skills, Experience, Projects)
// -------------------------------------------------------------
export async function fetchPortfolioData(): Promise<{ data: PortfolioData; isFromMongo: boolean }> {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const { skills = [], experiences = [], projects = [] } = json.data;
        // If MongoDB was empty, seed with initial
        if (skills.length === 0 && experiences.length === 0 && projects.length === 0) {
          const fallback = getLocalPortfolio();
          return { data: fallback, isFromMongo: true };
        }
        const mongoData: PortfolioData = { skills, experiences, projects };
        saveLocalPortfolio(mongoData);
        return { data: mongoData, isFromMongo: true };
      }
    }
  } catch (err) {
    console.warn('API /api/portfolio unreachable, using local storage cache:', err);
  }

  return { data: getLocalPortfolio(), isFromMongo: false };
}

// -------------------------------------------------------------
// SYNC ALL PORTFOLIO DATA TO MONGODB ATLAS
// -------------------------------------------------------------
export async function syncPortfolioToMongo(
  data: PortfolioData
): Promise<{ success: boolean; message: string; data?: PortfolioData }> {
  try {
    saveLocalPortfolio(data);
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'syncAll',
        skills: data.skills,
        experiences: data.experiences,
        projects: data.projects,
      }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        if (json.data) saveLocalPortfolio(json.data);
        return { success: true, message: 'All portfolio data successfully pushed to your MongoDB cluster!', data: json.data };
      }
    }
    const errJson = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errJson.message || 'Server error while sending to MongoDB',
    };
  } catch (err: any) {
    console.warn('Could not connect to MongoDB server:', err);
    return {
      success: false,
      message: 'Backend server is not running on port 5000. Changes saved to local cache.',
    };
  }
}

// -------------------------------------------------------------
// SKILLS CRUD
// -------------------------------------------------------------
export async function createSkill(skill: Skill): Promise<Skill> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'skill', item: skill }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.skills.unshift(json.data);
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, creating skill locally:', err);
  }

  const newSkill: Skill = { ...skill, _id: 'skl_' + Date.now().toString(36) };
  current.skills.unshift(newSkill);
  saveLocalPortfolio(current);
  return newSkill;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<Skill> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=skill&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'skill', id, item: skill }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.skills = current.skills.map((s) => (s._id === id ? json.data : s));
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, updating skill locally:', err);
  }

  current.skills = current.skills.map((s) => (s._id === id ? ({ ...s, ...skill } as Skill) : s));
  saveLocalPortfolio(current);
  return current.skills.find((s) => s._id === id) || (skill as Skill);
}

export async function deleteSkill(id: string): Promise<boolean> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=skill&id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        current.skills = current.skills.filter((s) => s._id !== id);
        saveLocalPortfolio(current);
        return true;
      }
    }
  } catch (err) {
    console.warn('Backend offline, deleting skill locally:', err);
  }

  current.skills = current.skills.filter((s) => s._id !== id);
  saveLocalPortfolio(current);
  return true;
}

// -------------------------------------------------------------
// EXPERIENCES CRUD
// -------------------------------------------------------------
export async function createExperience(exp: Experience): Promise<Experience> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'experience', item: exp }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.experiences.unshift(json.data);
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, creating experience locally:', err);
  }

  const newExp: Experience = { ...exp, _id: 'exp_' + Date.now().toString(36) };
  current.experiences.unshift(newExp);
  saveLocalPortfolio(current);
  return newExp;
}

export async function updateExperience(id: string, exp: Partial<Experience>): Promise<Experience> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=experience&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'experience', id, item: exp }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.experiences = current.experiences.map((e) => (e._id === id ? json.data : e));
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, updating experience locally:', err);
  }

  current.experiences = current.experiences.map((e) => (e._id === id ? ({ ...e, ...exp } as Experience) : e));
  saveLocalPortfolio(current);
  return current.experiences.find((e) => e._id === id) || (exp as Experience);
}

export async function deleteExperience(id: string): Promise<boolean> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=experience&id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        current.experiences = current.experiences.filter((e) => e._id !== id);
        saveLocalPortfolio(current);
        return true;
      }
    }
  } catch (err) {
    console.warn('Backend offline, deleting experience locally:', err);
  }

  current.experiences = current.experiences.filter((e) => e._id !== id);
  saveLocalPortfolio(current);
  return true;
}

// -------------------------------------------------------------
// PROJECTS CRUD
// -------------------------------------------------------------
export async function createProject(project: Project): Promise<Project> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'project', item: project }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.projects.unshift(json.data);
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, creating project locally:', err);
  }

  const newProject: Project = { ...project, _id: 'prj_' + Date.now().toString(36) };
  current.projects.unshift(newProject);
  saveLocalPortfolio(current);
  return newProject;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=project&id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'project', id, item: project }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        current.projects = current.projects.map((p) => (p._id === id ? json.data : p));
        saveLocalPortfolio(current);
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Backend offline, updating project locally:', err);
  }

  current.projects = current.projects.map((p) => (p._id === id ? ({ ...p, ...project } as Project) : p));
  saveLocalPortfolio(current);
  return current.projects.find((p) => p._id === id) || (project as Project);
}

export async function deleteProject(id: string): Promise<boolean> {
  const current = getLocalPortfolio();
  try {
    const res = await fetch(`${API_BASE}?type=project&id=${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        current.projects = current.projects.filter((p) => p._id !== id);
        saveLocalPortfolio(current);
        return true;
      }
    }
  } catch (err) {
    console.warn('Backend offline, deleting project locally:', err);
  }

  current.projects = current.projects.filter((p) => p._id !== id);
  saveLocalPortfolio(current);
  return true;
}
