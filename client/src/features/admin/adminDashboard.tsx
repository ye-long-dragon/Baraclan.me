import { useState, useEffect } from 'react';
import type { User } from '../../dataTypes/dataTypeUser';
import type { Skill, Experience, Project, PortfolioData } from '../../dataTypes/dataTypesPortfolio';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  checkBackendStatus,
  DEFAULT_ADMIN,
} from '../../api/users/user';
import {
  fetchPortfolioData,
  createSkill,
  updateSkill,
  deleteSkill,
  createExperience,
  updateExperience,
  deleteExperience,
  createProject,
  updateProject,
  deleteProject,
  syncPortfolioToMongo,
} from '../../api/portfolio/apiPortfolio';

interface AdminDashboardProps {
  onNavigatePortfolio?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

type TabType = 'users' | 'portfolio' | 'database';
type PortfolioSubTab = 'skills' | 'projects' | 'experiences';

export function AdminDashboard({
  onNavigatePortfolio,
  darkMode = false,
  onToggleDarkMode,
}: AdminDashboardProps) {
  // Navigation / Tabs
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [portfolioTab, setPortfolioTab] = useState<PortfolioSubTab>('skills');

  // Backend / MongoDB status
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string }>({
    connected: false,
    message: 'Checking status...',
  });
  const [syncingMongo, setSyncingMongo] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User Management State
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<{
    name: string;
    email: string;
    password: string;
    rePassword: string;
    role: 'admin' | 'user';
    img: string;
  }>({
    name: '',
    email: '',
    password: '',
    rePassword: '',
    role: 'user',
    img: '',
  });

  // Portfolio Management State
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    skills: [],
    experiences: [],
    projects: [],
  });
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<Skill>({
    skillName: '',
    focus: 'Web',
    img: '',
    descrip: '',
  });

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    name: '',
    img: '',
    role: '',
    date: '',
    techStack: '',
    description: '',
  });

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<Experience>({
    type: 'Work',
    company: '',
    subDescrip: '',
    date: '',
    descrip: '',
  });

  // Show toast notification
  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    // Check backend connection
    const status = await checkBackendStatus();
    setDbStatus(status);

    // Fetch users
    setLoadingUsers(true);
    const { users: fetchedUsers } = await fetchUsers();
    setUsers(fetchedUsers);
    setLoadingUsers(false);

    // Fetch portfolio items
    setLoadingPortfolio(true);
    const { data: fetchedPortfolio } = await fetchPortfolioData();
    setPortfolioData(fetchedPortfolio);
    setLoadingPortfolio(false);
  };

  // -------------------------------------------------------------
  // USER CRUD OPERATIONS
  // -------------------------------------------------------------
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserForm({
      name: '',
      email: '',
      password: '',
      rePassword: '',
      role: 'user',
      img: '',
    });
    setUserModalOpen(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name || '',
      email: user.email,
      password: '',
      rePassword: '',
      role: user.role || 'user',
      img: user.img || '',
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.email.trim()) {
      showToast('Email is required', 'error');
      return;
    }

    if (!editingUser) {
      if (!userForm.password) {
        showToast('Password is required for new accounts', 'error');
        return;
      }
      if (userForm.password !== userForm.rePassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    } else if (userForm.password && userForm.password !== userForm.rePassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    try {
      if (editingUser && editingUser._id) {
        const payload: Partial<User> = {
          name: userForm.name,
          email: userForm.email,
          role: userForm.role,
          img: userForm.img,
        };
        if (userForm.password) payload.password = userForm.password;

        const updated = await updateUser(editingUser._id, payload);
        setUsers((prev) => prev.map((u) => (u._id === updated._id ? updated : u)));
        showToast(`User ${updated.email} updated successfully!`);
      } else {
        const created = await createUser({
          name: userForm.name,
          email: userForm.email,
          password: userForm.password,
          rePassword: userForm.rePassword,
          role: userForm.role,
          img: userForm.img,
        });
        setUsers((prev) => [created, ...prev]);
        showToast(`User ${created.email} created successfully!`);
      }
      setUserModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to save user', 'error');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.email === DEFAULT_ADMIN.email) {
      showToast('Cannot delete the primary owner account!', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user ${user.email}?`)) {
      return;
    }
    try {
      if (user._id) {
        await deleteUser(user._id);
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        showToast(`User ${user.email} removed successfully.`);
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting user', 'error');
    }
  };

  // -------------------------------------------------------------
  // SYNC ALL PORTFOLIO DATA TO MONGODB
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // SKILL CRUD
  // -------------------------------------------------------------
  const handleOpenSkillModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm(skill);
    } else {
      setEditingSkill(null);
      setSkillForm({ skillName: '', focus: 'Web', img: '', descrip: '' });
    }
    setSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.skillName.trim()) {
      showToast('Skill name is required', 'error');
      return;
    }
    if (editingSkill && editingSkill._id) {
      const updated = await updateSkill(editingSkill._id, skillForm);
      setPortfolioData((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => (s._id === updated._id ? updated : s)),
      }));
      showToast(`Skill "${updated.skillName}" updated!`);
    } else {
      const created = await createSkill(skillForm);
      setPortfolioData((prev) => ({
        ...prev,
        skills: [created, ...prev.skills],
      }));
      showToast(`Skill "${created.skillName}" added!`);
    }
    setSkillModalOpen(false);
  };

  const handleDeleteSkill = async (skill: Skill) => {
    if (!window.confirm(`Delete skill "${skill.skillName}"?`)) return;
    if (skill._id) {
      await deleteSkill(skill._id);
      setPortfolioData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s._id !== skill._id),
      }));
      showToast(`Skill "${skill.skillName}" deleted.`);
    }
  };

  // -------------------------------------------------------------
  // PROJECT CRUD
  // -------------------------------------------------------------
  const handleOpenProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm(project);
    } else {
      setEditingProject(null);
      setProjectForm({
        name: '',
        img: '',
        role: '',
        date: '',
        techStack: '',
        description: '',
      });
    }
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      showToast('Project name is required', 'error');
      return;
    }
    if (editingProject && editingProject._id) {
      const updated = await updateProject(editingProject._id, projectForm);
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) => (p._id === updated._id ? updated : p)),
      }));
      showToast(`Project "${updated.name}" updated!`);
    } else {
      const created = await createProject(projectForm);
      setPortfolioData((prev) => ({
        ...prev,
        projects: [created, ...prev.projects],
      }));
      showToast(`Project "${created.name}" created!`);
    }
    setProjectModalOpen(false);
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Delete project "${project.name}"?`)) return;
    if (project._id) {
      await deleteProject(project._id);
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.filter((p) => p._id !== project._id),
      }));
      showToast(`Project "${project.name}" removed.`);
    }
  };

  // -------------------------------------------------------------
  // EXPERIENCE CRUD
  // -------------------------------------------------------------
  const handleOpenExpModal = (exp?: Experience) => {
    if (exp) {
      setEditingExp(exp);
      setExpForm(exp);
    } else {
      setEditingExp(null);
      setExpForm({
        type: 'Work',
        company: '',
        subDescrip: '',
        date: '',
        descrip: '',
      });
    }
    setExpModalOpen(true);
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company.trim()) {
      showToast('Company/Institution name is required', 'error');
      return;
    }
    if (editingExp && editingExp._id) {
      const updated = await updateExperience(editingExp._id, expForm);
      setPortfolioData((prev) => ({
        ...prev,
        experiences: prev.experiences.map((e) => (e._id === updated._id ? updated : e)),
      }));
      showToast(`Experience at "${updated.company}" updated!`);
    } else {
      const created = await createExperience(expForm);
      setPortfolioData((prev) => ({
        ...prev,
        experiences: [created, ...prev.experiences],
      }));
      showToast(`Experience at "${created.company}" created!`);
    }
    setExpModalOpen(false);
  };

  const handleDeleteExp = async (exp: Experience) => {
    if (!window.confirm(`Delete experience at "${exp.company}"?`)) return;
    if (exp._id) {
      await deleteExperience(exp._id);
      setPortfolioData((prev) => ({
        ...prev,
        experiences: prev.experiences.filter((e) => e._id !== exp._id),
      }));
      showToast(`Experience at "${exp.company}" removed.`);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 shadow-2xl transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✓' : '✕'}</span>
          <p className="text-sm font-medium">{toastMessage.text}</p>
        </div>
      )}

      {/* Top Header / Navigation Bar */}
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
            {/* MongoDB Connection Status Pill */}
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                dbStatus.connected
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  dbStatus.connected ? 'animate-pulse bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{dbStatus.message}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Switch to Public Portfolio */}
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* User (Me) Profile Overview Banner */}
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

            {/* Quick Stats Grid */}
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-950 min-w-20">
                <span className="text-xs text-zinc-400">Accounts</span>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{users.length}</p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-950 min-w-20">
                <span className="text-xs text-zinc-400">Skills</span>
                <p className="text-xl font-bold text-violet-600 dark:text-violet-400">
                  {portfolioData.skills.length}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-950 min-w-20">
                <span className="text-xs text-zinc-400">Projects</span>
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {portfolioData.projects.length}
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-950 min-w-20">
                <span className="text-xs text-zinc-400">Experiences</span>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {portfolioData.experiences.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top-Level Tabs: Accounts vs Portfolio vs Database */}
        <div className="mb-6 flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === 'users'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <span>👥 All Accounts ({users.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === 'portfolio'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <span>💼 Portfolio Data Types</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold transition ${
              activeTab === 'database'
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <span>⚡ MongoDB Sync & Env</span>
          </button>
        </div>

        {/* TAB 1: ACCOUNTS & USER CRUD */}
        {activeTab === 'users' && (
          <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">User Accounts</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Manage login accounts with password encryption (bcrypt) and role-based access.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleOpenCreateUser}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
                >
                  <span>+</span>
                  <span>Create Account</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Account User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {loadingUsers ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        Loading accounts...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-500">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id || user.email} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                user.img ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                                  user.name || user.email
                                )}`
                              }
                              alt={user.email}
                              className="h-10 w-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                            />
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                {user.name || 'Unnamed User'}
                              </p>
                              <p className="text-xs text-zinc-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                                : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-zinc-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditUser(user)}
                              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                              Edit
                            </button>
                            {user.email !== DEFAULT_ADMIN.email && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: PORTFOLIO DATA TYPES (SKILLS, PROJECTS, EXPERIENCE) */}
        {activeTab === 'portfolio' && (
          <section className="space-y-6">
            {/* Top Toolbar: Subtabs + Send to MongoDB */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Subtabs */}
              <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  type="button"
                  onClick={() => setPortfolioTab('skills')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                    portfolioTab === 'skills'
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  Skills ({portfolioData.skills.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioTab('projects')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                    portfolioTab === 'projects'
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  Projects ({portfolioData.projects.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioTab('experiences')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                    portfolioTab === 'experiences'
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  Experiences ({portfolioData.experiences.length})
                </button>
              </div>

              {/* Actions: Send to MongoDB and Add Item */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSyncToMongo}
                  disabled={syncingMongo}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <span>{syncingMongo ? '⏳' : '💾'}</span>
                  <span>{syncingMongo ? 'Sending to MongoDB...' : 'Send All to MongoDB'}</span>
                </button>

                {portfolioTab === 'skills' && (
                  <button
                    type="button"
                    onClick={() => handleOpenSkillModal()}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    <span>+</span>
                    <span>Add Skill</span>
                  </button>
                )}
                {portfolioTab === 'projects' && (
                  <button
                    type="button"
                    onClick={() => handleOpenProjectModal()}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    <span>+</span>
                    <span>Add Project</span>
                  </button>
                )}
                {portfolioTab === 'experiences' && (
                  <button
                    type="button"
                    onClick={() => handleOpenExpModal()}
                    className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                  >
                    <span>+</span>
                    <span>Add Experience</span>
                  </button>
                )}
              </div>
            </div>

            {/* 1. SKILLS SUBTAB */}
            {portfolioTab === 'skills' && (
              loadingPortfolio ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Loading skills...
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolioData.skills.map((skill) => (
                  <article
                    key={skill._id || skill.skillName}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-violet-400 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-start gap-4">
                      {skill.img ? (
                        <img
                          src={skill.img}
                          alt={skill.skillName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-lg font-bold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                          {skill.skillName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {skill.skillName}
                          </h4>
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {skill.focus}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {skill.descrip}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => handleOpenSkillModal(skill)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(skill)}
                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              )
            )}

            {/* 2. PROJECTS SUBTAB */}
            {portfolioTab === 'projects' && (
              loadingPortfolio ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Loading projects...
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                {portfolioData.projects.map((proj) => (
                  <article
                    key={proj._id || proj.name}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div>
                      {proj.img && (
                        <img
                          src={proj.img}
                          alt={proj.name}
                          className="mb-3 h-40 w-full rounded-lg object-cover"
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          {proj.name}
                        </h4>
                        <span className="text-xs text-zinc-400">{proj.date}</span>
                      </div>
                      <p className="text-xs font-medium text-violet-600 dark:text-violet-400">
                        {proj.role}
                      </p>
                      <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                        {proj.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {proj.techStack.split(',').map((t) => (
                          <span
                            key={t.trim()}
                            className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={() => handleOpenProjectModal(proj)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj)}
                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              )
            )}

            {/* 3. EXPERIENCES SUBTAB */}
            {portfolioTab === 'experiences' && (
              loadingPortfolio ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Loading experiences...
                </div>
              ) : (
                <div className="space-y-3">
                {portfolioData.experiences.map((exp) => (
                  <article
                    key={exp._id || `${exp.company}-${exp.date}`}
                    className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            exp.type === 'Education'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}
                        >
                          {exp.type}
                        </span>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {exp.company}
                        </h4>
                        <span className="text-xs text-zinc-400">· {exp.date}</span>
                      </div>
                      <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        {exp.subDescrip}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{exp.descrip}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-2 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => handleOpenExpModal(exp)}
                        className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExp(exp)}
                        className="rounded-lg border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              )
            )}
          </section>
        )}

        {/* TAB 3: DATABASE & ENV OVERVIEW */}
        {activeTab === 'database' && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                MongoDB Atlas Configuration
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Connected database cluster from your local environment file (<code className="text-xs">.env</code>).
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                  <span className="text-xs font-medium text-zinc-500">MongoDB Connection String</span>
                  <p className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">
                    mongodb+srv://bvincelawrence_db_user:••••••••@portfolio.fs5ovxz.mongodb.net/portfolio
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="text-xs font-medium text-zinc-500">Database User</span>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      bvincelawrence_db_user
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="text-xs font-medium text-zinc-500">Cluster Name</span>
                    <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      portfolio.fs5ovxz.mongodb.net
                    </p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <span className="text-xs font-medium text-zinc-500">Live Status</span>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        dbStatus.connected ? 'text-emerald-600' : 'text-amber-500'
                      }`}
                    >
                      {dbStatus.message}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleSyncToMongo}
                    disabled={syncingMongo}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {syncingMongo ? 'Syncing...' : 'Sync Current Portfolio State to MongoDB'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE / EDIT USER */}
      {/* ========================================================= */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {editingUser ? 'Edit User Account' : 'Create New User Account'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {editingUser ? 'Update account info or change password.' : 'Enter new user credentials.'}
            </p>

            <form onSubmit={handleSaveUser} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Vince Lawrence"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  value={userForm.rePassword}
                  onChange={(e) => setUserForm({ ...userForm, rePassword: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Account Role
                </label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'user' })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={userForm.img}
                  onChange={(e) => setUserForm({ ...userForm, img: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE / EDIT SKILL */}
      {/* ========================================================= */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <form onSubmit={handleSaveSkill} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.skillName}
                  onChange={(e) => setSkillForm({ ...skillForm, skillName: e.target.value })}
                  placeholder="e.g. React, Python, Embedded C++"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Focus Area
                </label>
                <select
                  value={skillForm.focus}
                  onChange={(e) =>
                    setSkillForm({
                      ...skillForm,
                      focus: e.target.value as 'Software' | 'Hardware' | 'Data' | 'AI' | 'Web',
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="Web">Web</option>
                  <option value="Software">Software</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Data">Data</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Icon / Image URL
                </label>
                <input
                  type="text"
                  value={skillForm.img}
                  onChange={(e) => setSkillForm({ ...skillForm, img: e.target.value })}
                  placeholder="https://... or leave empty"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={skillForm.descrip}
                  onChange={(e) => setSkillForm({ ...skillForm, descrip: e.target.value })}
                  placeholder="Brief description of what you build with this..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CREATE / EDIT PROJECT */}
      {/* ========================================================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </h3>
            <form onSubmit={handleSaveProject} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="e.g. Smart IoT Gateway"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Role
                  </label>
                  <input
                    type="text"
                    value={projectForm.role}
                    onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                    placeholder="e.g. Hardware Lead"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Date / Year
                  </label>
                  <input
                    type="text"
                    value={projectForm.date}
                    onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                    placeholder="e.g. 2026"
                    className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={projectForm.techStack}
                  onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                  placeholder="React, TypeScript, ESP32, MongoDB"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Project Image URL
                </label>
                <input
                  type="text"
                  value={projectForm.img}
                  onChange={(e) => setProjectForm({ ...projectForm, img: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="What does this project do and what problems does it solve?"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CREATE / EDIT EXPERIENCE */}
      {/* ========================================================= */}
      {expModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {editingExp ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <form onSubmit={handleSaveExp} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Type
                </label>
                <select
                  value={expForm.type}
                  onChange={(e) => setExpForm({ ...expForm, type: e.target.value as 'Education' | 'Work' })}
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="Work">Work</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Company / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  placeholder="e.g. University / Tech Corp"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Sub-description / Degree / Role
                </label>
                <input
                  type="text"
                  value={expForm.subDescrip}
                  onChange={(e) => setExpForm({ ...expForm, subDescrip: e.target.value })}
                  placeholder="e.g. BS Computer Engineering / Software Intern"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Date / Range
                </label>
                <input
                  type="text"
                  value={expForm.date}
                  onChange={(e) => setExpForm({ ...expForm, date: e.target.value })}
                  placeholder="e.g. 2023 - Present"
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={expForm.descrip}
                  onChange={(e) => setExpForm({ ...expForm, descrip: e.target.value })}
                  placeholder="Details about responsibilities, coursework, or achievements..."
                  className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setExpModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
