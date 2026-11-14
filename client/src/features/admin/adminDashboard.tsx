import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { User } from '../../dataTypes/dataTypeUser';
import type { UserForm } from '../../dataTypes/dataTypeUserForm';
import type { Skill, Experience, Project, PortfolioData } from '../../dataTypes/dataTypesPortfolio';
import { deleteUser, DEFAULT_ADMIN } from '../../api/users/user';
import { saveUser } from '../../api/admin/saveUser';
import { loadAdminData } from '../../api/admin/loadAdminData';
import { syncPortfolioToMongo } from '../../api/portfolio/apiPortfolio';
import { skillApi, projectApi, experienceApi } from '../../api/admin/crudApi';
import {
  validateUserForm,
  validateSkill,
  validateProject,
  validateExperience,
} from '../../api/admin/adminForms';

import { UsersTab } from './components/tabs/UsersTab';
import { PortfolioTab } from './components/tabs/PortfolioTab';
import { DatabaseTab } from './components/tabs/DatabaseTab';
import { UserModal } from './components/modals/UserModal';
import { SkillModal } from './components/modals/SkillModal';
import { ProjectModal } from './components/modals/ProjectModal';
import { ExperienceModal } from './components/modals/ExperienceModal';
import { useToast } from './hooks/useToast';
import { useCrudModal, getErrorMessage } from './hooks/useCrudModal';

interface AdminDashboardProps {
  onNavigatePortfolio?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

type TabType = 'users' | 'portfolio' | 'database';
type PortfolioSubTab = 'skills' | 'projects' | 'experiences';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const EMPTY_USER_FORM: UserForm = { name: '', email: '', password: '', rePassword: '', role: 'user', img: '' };
const EMPTY_SKILL: Skill = { skillName: '', focus: 'Web', img: '', descrip: '' };
const EMPTY_PROJECT: Project = { name: '', img: '', role: '', date: '', techStack: '', description: '' };
const EMPTY_EXPERIENCE: Experience = { type: 'Work', company: '', subDescrip: '', date: '', descrip: '' };

const TAB_BASE = 'flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition';
const TAB_ACTIVE = 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400';
const TAB_IDLE =
  'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function AdminDashboard({
  onNavigatePortfolio,
  darkMode = false,
  onToggleDarkMode,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [portfolioTab, setPortfolioTab] = useState<PortfolioSubTab>('skills');
  const { toast, showToast } = useToast();

  // Backend status
  const [dbStatus, setDbStatus] = useState({ connected: false, message: 'Checking status...' });
  const [syncingMongo, setSyncingMongo] = useState(false);

  // Data
  const [users, setUsers] = useState<User[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    skills: [],
    experiences: [],
    projects: [],
  });
  const [loading, setLoading] = useState(true);

  // User modal state
  const [userSearch, setUserSearch] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserForm>(EMPTY_USER_FORM);

  // Updates one list inside portfolioData (skills / projects / experiences)
  const listUpdater =
    <K extends keyof PortfolioData>(key: K) =>
      (updater: (items: PortfolioData[K]) => PortfolioData[K]) =>
        setPortfolioData((prev) => ({ ...prev, [key]: updater(prev[key]) }));

  const skills = useCrudModal<Skill>({
    label: 'Skill',
    emptyForm: EMPTY_SKILL,
    getName: (s) => s.skillName,
    api: skillApi,
    onItemsChange: listUpdater('skills'),
    showToast,
    validate: validateSkill,
  });

  const projects = useCrudModal<Project>({
    label: 'Project',
    emptyForm: EMPTY_PROJECT,
    getName: (p) => p.name,
    api: projectApi,
    onItemsChange: listUpdater('projects'),
    showToast,
    validate: validateProject,
  });

  const experiences = useCrudModal<Experience>({
    label: 'Experience',
    emptyForm: EMPTY_EXPERIENCE,
    getName: (e) => e.company,
    api: experienceApi,
    onItemsChange: listUpdater('experiences'),
    showToast,
    validate: validateExperience,
  });

  // Initial load
  useEffect(() => {
    loadAdminData().then(({ status, users, portfolio }) => {
      setDbStatus(status);
      setUsers(users);
      setPortfolioData(portfolio);
      setLoading(false);
    });
  }, []);

  // ---- Users ----
  const handleOpenUserModal = (user?: User) => {
    setEditingUser(user ?? null);
    setUserForm(
      user
        ? {
          ...EMPTY_USER_FORM,
          name: user.name || '',
          email: user.email,
          role: user.role || 'user',
          img: user.img || '',
        }
        : EMPTY_USER_FORM,
    );
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: FormEvent) => {
    e.preventDefault();

    const error = validateUserForm(userForm, !!editingUser);
    if (error) return showToast(error, 'error');

    try {
      const saved = await saveUser(userForm, editingUser?._id);
      setUsers((prev) =>
        editingUser ? prev.map((u) => (u._id === saved._id ? saved : u)) : [saved, ...prev],
      );
      showToast(`User ${saved.email} ${editingUser ? 'updated' : 'created'} successfully!`);
      setUserModalOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save user'), 'error');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.email === DEFAULT_ADMIN.email) {
      return showToast('Cannot delete the primary owner account!', 'error');
    }
    if (!user._id || !window.confirm(`Are you sure you want to delete user ${user.email}?`)) return;

    try {
      await deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      showToast(`User ${user.email} removed successfully.`);
    } catch (err) {
      showToast(getErrorMessage(err, 'Error deleting user'), 'error');
    }
  };

  // ---- Mongo sync ----
  const handleSyncToMongo = async () => {
    setSyncingMongo(true);
    const result = await syncPortfolioToMongo(portfolioData);
    setSyncingMongo(false);

    if (result.success) {
      setDbStatus({ connected: true, message: 'MongoDB Online' });
      showToast('All portfolio data successfully sent to MongoDB Atlas!');
    } else {
      showToast(result.message, 'error');
    }
  };

  // ---- View config ----
  const tabs: { id: TabType; label: string }[] = [
    { id: 'users', label: `👥 All Accounts (${users.length})` },
    { id: 'portfolio', label: '💼 Portfolio Data Types' },
    { id: 'database', label: '⚡ MongoDB Sync & Env' },
  ];

  const stats = [
    { label: 'Accounts', value: users.length, color: 'text-zinc-900 dark:text-zinc-100' },
    { label: 'Skills', value: portfolioData.skills.length, color: 'text-violet-600 dark:text-violet-400' },
    { label: 'Projects', value: portfolioData.projects.length, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Experiences', value: portfolioData.experiences.length, color: 'text-blue-600 dark:text-blue-400' },
  ];

  return (
    <div className="min-h-screen transition-colors duration-200">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 text-white shadow-2xl transition-all ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
        >
          <span>{toast.type === 'success' ? '✓' : '✕'}</span>
          <p className="text-sm font-medium">{toast.text}</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 font-bold text-white shadow-md shadow-violet-500/20">
              VB
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Admin Control Center
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Portfolio & Account Management · Baraclan.me
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${dbStatus.connected
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400'
                }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${dbStatus.connected ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'
                  }`}
              />
              <span>{dbStatus.message}</span>
            </div>

            <button
              type="button"
              onClick={onToggleDarkMode}
              title="Toggle Dark Mode"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {onNavigatePortfolio && (
              <button
                type="button"
                onClick={onNavigatePortfolio}
                className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <span>Live Portfolio</span>
                <span>→</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Profile banner */}
        <section className="mb-8 rounded-2xl border border-zinc-200 bg-gradient-to-r from-zinc-50 via-white to-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-900">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <img
                src={DEFAULT_ADMIN.img || 'https://avatars.githubusercontent.com/u/158171645?v=4'}
                alt={DEFAULT_ADMIN.name}
                className="h-20 w-20 rounded-2xl border-2 border-violet-500 object-cover shadow-lg shadow-violet-500/10"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {DEFAULT_ADMIN.name}
                  </h2>
                  <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                    Super Admin (Me)
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {DEFAULT_ADMIN.email} · MongoDB User: <code className="text-xs">bvincelawrence_db_user</code>
                </p>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  Full CRUD permissions enabled for user accounts, portfolio skills, projects, and work experience.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {stats.map(({ label, value, color }) => (
                <div
                  key={label}
                  className="min-w-20 rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <span className="text-xs text-zinc-400">{label}</span>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mb-6 flex border-b border-zinc-200 dark:border-zinc-800">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`${TAB_BASE} ${activeTab === id ? TAB_ACTIVE : TAB_IDLE}`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            loadingUsers={loading}
            userSearch={userSearch}
            onSearchChange={setUserSearch}
            onOpenCreateUser={() => handleOpenUserModal()}
            onOpenEditUser={handleOpenUserModal}
            onDeleteUser={handleDeleteUser}
            defaultAdminEmail={DEFAULT_ADMIN.email}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioTab
            portfolioData={portfolioData}
            loadingPortfolio={loading}
            portfolioTab={portfolioTab}
            onSetPortfolioTab={setPortfolioTab}
            syncingMongo={syncingMongo}
            onSyncToMongo={handleSyncToMongo}
            onOpenSkillModal={skills.open}
            onDeleteSkill={skills.remove}
            onOpenProjectModal={projects.open}
            onDeleteProject={projects.remove}
            onOpenExpModal={experiences.open}
            onDeleteExp={experiences.remove}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseTab dbStatus={dbStatus} syncingMongo={syncingMongo} onSyncToMongo={handleSyncToMongo} />
        )}
      </main>

      {/* Modals */}
      <UserModal
        isOpen={userModalOpen}
        editingUser={editingUser}
        userForm={userForm}
        onFormChange={setUserForm}
        onClose={() => setUserModalOpen(false)}
        onSave={handleSaveUser}
      />
      <SkillModal
        isOpen={skills.isOpen}
        editingSkill={skills.editing}
        skillForm={skills.form}
        onFormChange={skills.setForm}
        onClose={skills.close}
        onSave={skills.save}
      />
      <ProjectModal
        isOpen={projects.isOpen}
        editingProject={projects.editing}
        projectForm={projects.form}
        onFormChange={projects.setForm}
        onClose={projects.close}
        onSave={projects.save}
      />
      <ExperienceModal
        isOpen={experiences.isOpen}
        editingExp={experiences.editing}
        expForm={experiences.form}
        onFormChange={experiences.setForm}
        onClose={experiences.close}
        onSave={experiences.save}
      />
    </div>
  );
}

export default AdminDashboard;