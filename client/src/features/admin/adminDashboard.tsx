import { useState } from 'react';
import type { Project, Skill, Experience } from '../../dataTypes/dataTypesPortfolio';
import { useProjects } from '../portfolio/hooks/useProjects';
import { useSkills } from '../portfolio/hooks/useSkills';
import { useExperiences } from '../portfolio/hooks/useExperiences';
import { useToast } from './hooks/useToast';
import { PROFILE } from '../../lib/profile';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { SkillsTab } from './components/tabs/SkillsTab';
import { ExperienceTab } from './components/tabs/ExperienceTab';
import { ProjectModal } from './components/modals/ProjectModal';
import { SkillModal } from './components/modals/SkillModal';
import { ExperienceModal } from './components/modals/ExperienceModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { ToastContainer } from './components/ToastContainer';

interface AdminDashboardProps {
  adminEmail: string | null;
  onLogout: () => Promise<void>;
  onNavigatePortfolio?: () => void;
}

type TabType = 'projects' | 'skills' | 'experiences';

const initialProject: Project = {
  name: '',
  img: '',
  role: '',
  date: '',
  techStack: '',
  description: '',
};

const initialSkill: Skill = {
  skillName: '',
  focus: 'Software',
  img: '',
  descrip: '',
};

const initialExperience: Experience = {
  type: 'Education',
  company: '',
  subDescrip: '',
  date: '',
  descrip: '',
};

export function AdminDashboard({
  adminEmail,
  onLogout,
  onNavigatePortfolio,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('projects');
  const { toast, showToast } = useToast();

  // CRUD Hooks
  const {
    items: projects,
    loading: projectsLoading,
    create: createProject,
    update: updateProject,
    remove: removeProject,
  } = useProjects();

  const {
    items: skills,
    loading: skillsLoading,
    create: createSkill,
    update: updateSkill,
    remove: removeSkill,
  } = useSkills();

  const {
    items: experiences,
    loading: experiencesLoading,
    create: createExperience,
    update: updateExperience,
    remove: removeExperience,
  } = useExperiences();

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Project>(initialProject);

  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<Skill>(initialSkill);

  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [experienceForm, setExperienceForm] = useState<Experience>(initialExperience);

  // Delete Confirm Dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'project' | 'skill' | 'experience';
    id: string;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Project handlers
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjectForm(initialProject);
    setProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject(p);
    setProjectForm(p);
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingProject && (editingProject.id || editingProject._id)) {
        const id = editingProject.id || editingProject._id!;
        await updateProject(id, projectForm);
        showToast('Project updated successfully', 'success');
      } else {
        await createProject(projectForm);
        showToast('Project created successfully', 'success');
      }
      setProjectModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save project', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Skill handlers
  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillForm(initialSkill);
    setSkillModalOpen(true);
  };

  const handleOpenEditSkill = (s: Skill) => {
    setEditingSkill(s);
    setSkillForm(s);
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingSkill && (editingSkill.id || editingSkill._id)) {
        const id = editingSkill.id || editingSkill._id!;
        await updateSkill(id, skillForm);
        showToast('Skill updated successfully', 'success');
      } else {
        await createSkill(skillForm);
        showToast('Skill created successfully', 'success');
      }
      setSkillModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save skill', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Experience handlers
  const handleOpenAddExperience = () => {
    setEditingExperience(null);
    setExperienceForm(initialExperience);
    setExperienceModalOpen(true);
  };

  const handleOpenEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setExperienceForm(exp);
    setExperienceModalOpen(true);
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingExperience && (editingExperience.id || editingExperience._id)) {
        const id = editingExperience.id || editingExperience._id!;
        await updateExperience(id, experienceForm);
        showToast('Experience updated successfully', 'success');
      } else {
        await createExperience(experienceForm);
        showToast('Experience created successfully', 'success');
      }
      setExperienceModalOpen(false);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to save experience', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'project') {
        await removeProject(itemToDelete.id);
        showToast(`Project "${itemToDelete.title}" deleted`, 'success');
      } else if (itemToDelete.type === 'skill') {
        await removeSkill(itemToDelete.id);
        showToast(`Skill "${itemToDelete.title}" deleted`, 'success');
      } else if (itemToDelete.type === 'experience') {
        await removeExperience(itemToDelete.id);
        showToast(`Experience at "${itemToDelete.title}" deleted`, 'success');
      }
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy font-main text-gold flex flex-col justify-between">
      <div>
        {/* Admin Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="font-name text-lg font-bold tracking-tight text-gold">
                Admin Control Center
              </span>
              {adminEmail && (
                <span className="hidden sm:inline-block rounded border border-gold/20 bg-gold/10 px-2.5 py-0.5 text-xs text-gold/80">
                  {adminEmail}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              {onNavigatePortfolio && (
                <button
                  type="button"
                  onClick={onNavigatePortfolio}
                  className="font-main text-xs uppercase tracking-wider text-sand hover:text-gold transition"
                >
                  View Site
                </button>
              )}
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="font-main text-xs uppercase tracking-wider text-sand hover:text-gold transition"
              >
                GitHub
              </a>
              <button
                type="button"
                onClick={onLogout}
                className="rounded border border-gold/40 px-3 py-1.5 font-main text-xs uppercase tracking-wider text-gold hover:bg-gold/10 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Tabs */}
        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 border-b border-gold/20 flex gap-6 text-sm uppercase tracking-widest font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('projects')}
              className={`pb-3 transition ${
                activeTab === 'projects'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-sand/50 hover:text-sand'
              }`}
            >
              Projects ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className={`pb-3 transition ${
                activeTab === 'skills'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-sand/50 hover:text-sand'
              }`}
            >
              Skills ({skills.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('experiences')}
              className={`pb-3 transition ${
                activeTab === 'experiences'
                  ? 'border-b-2 border-gold text-gold'
                  : 'text-sand/50 hover:text-sand'
              }`}
            >
              Experience ({experiences.length})
            </button>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'projects' && (
            <ProjectsTab
              projects={projects}
              loading={projectsLoading}
              onAdd={handleOpenAddProject}
              onEdit={handleOpenEditProject}
              onDelete={(p) => {
                const id = p.id || p._id;
                if (!id) {
                  showToast('Cannot delete default fallback item', 'error');
                  return;
                }
                setItemToDelete({ type: 'project', id, title: p.name });
                setDeleteConfirmOpen(true);
              }}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsTab
              skills={skills}
              loading={skillsLoading}
              onAdd={handleOpenAddSkill}
              onEdit={handleOpenEditSkill}
              onDelete={(s) => {
                const id = s.id || s._id;
                if (!id) {
                  showToast('Cannot delete default fallback item', 'error');
                  return;
                }
                setItemToDelete({ type: 'skill', id, title: s.skillName });
                setDeleteConfirmOpen(true);
              }}
            />
          )}

          {activeTab === 'experiences' && (
            <ExperienceTab
              experiences={experiences}
              loading={experiencesLoading}
              onAdd={handleOpenAddExperience}
              onEdit={handleOpenEditExperience}
              onDelete={(exp) => {
                const id = exp.id || exp._id;
                if (!id) {
                  showToast('Cannot delete default fallback item', 'error');
                  return;
                }
                setItemToDelete({ type: 'experience', id, title: exp.company });
                setDeleteConfirmOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gold/20 bg-navy/80 px-6 py-6 text-center text-xs text-sand/60 font-sub">
        <p>
          Baraclan Control Center &bull;{' '}
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="text-gold hover:underline"
          >
            GitHub Repository
          </a>
        </p>
      </footer>

      {/* Modals */}
      <ProjectModal
        isOpen={projectModalOpen}
        editingProject={editingProject}
        projectForm={projectForm}
        onFormChange={setProjectForm}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
        isLoading={isSaving}
      />

      <SkillModal
        isOpen={skillModalOpen}
        editingSkill={editingSkill}
        skillForm={skillForm}
        onFormChange={setSkillForm}
        onClose={() => setSkillModalOpen(false)}
        onSave={handleSaveSkill}
        isLoading={isSaving}
      />

      <ExperienceModal
        isOpen={experienceModalOpen}
        editingExperience={editingExperience}
        experienceForm={experienceForm}
        onFormChange={setExperienceForm}
        onClose={() => setExperienceModalOpen(false)}
        onSave={handleSaveExperience}
        isLoading={isSaving}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title={`Delete ${itemToDelete?.type || 'item'}?`}
        message={`Are you sure you want to permanently delete "${itemToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
      />

      {/* Toast notifications */}
      <ToastContainer toast={toast} />
    </div>
  );
}

export default AdminDashboard;
