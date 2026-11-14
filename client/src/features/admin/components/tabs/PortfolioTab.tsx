import type { Skill, Experience, Project, PortfolioData } from '../../../../dataTypes/dataTypesPortfolio';

type PortfolioSubTab = 'skills' | 'projects' | 'experiences';

interface PortfolioTabProps {
  portfolioData: PortfolioData;
  loadingPortfolio: boolean;
  portfolioTab: PortfolioSubTab;
  onSetPortfolioTab: (tab: PortfolioSubTab) => void;
  syncingMongo: boolean;
  onSyncToMongo: () => void;
  onOpenSkillModal: (skill?: Skill) => void;
  onDeleteSkill: (skill: Skill) => void;
  onOpenProjectModal: (project?: Project) => void;
  onDeleteProject: (project: Project) => void;
  onOpenExpModal: (exp?: Experience) => void;
  onDeleteExp: (exp: Experience) => void;
}

export function PortfolioTab({
  portfolioData,
  loadingPortfolio,
  portfolioTab,
  onSetPortfolioTab,
  syncingMongo,
  onSyncToMongo,
  onOpenSkillModal,
  onDeleteSkill,
  onOpenProjectModal,
  onDeleteProject,
  onOpenExpModal,
  onDeleteExp,
}: PortfolioTabProps) {
  return (
    <section className="space-y-6">
      {/* Top Toolbar: Subtabs + Send to MongoDB */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Subtabs */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => onSetPortfolioTab('skills')}
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
            onClick={() => onSetPortfolioTab('projects')}
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
            onClick={() => onSetPortfolioTab('experiences')}
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
            onClick={onSyncToMongo}
            disabled={syncingMongo}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <span>{syncingMongo ? '⏳' : '💾'}</span>
            <span>{syncingMongo ? 'Sending to MongoDB...' : 'Send All to MongoDB'}</span>
          </button>

          {portfolioTab === 'skills' && (
            <button
              type="button"
              onClick={() => onOpenSkillModal()}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
            >
              <span>+</span>
              <span>Add Skill</span>
            </button>
          )}
          {portfolioTab === 'projects' && (
            <button
              type="button"
              onClick={() => onOpenProjectModal()}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
            >
              <span>+</span>
              <span>Add Project</span>
            </button>
          )}
          {portfolioTab === 'experiences' && (
            <button
              type="button"
              onClick={() => onOpenExpModal()}
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
                    onClick={() => onOpenSkillModal(skill)}
                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSkill(skill)}
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
                    onClick={() => onOpenProjectModal(proj)}
                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj)}
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
                    onClick={() => onOpenExpModal(exp)}
                    className="rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteExp(exp)}
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
  );
}
