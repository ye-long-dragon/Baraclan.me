import { useState, useEffect } from 'react';
import type { Skill, Experience, Project } from '../../dataTypes/dataTypesPortfolio';
import {
    skills as fallbackSkills,
    experiences as fallbackExperiences,
    projects as fallbackProjects,
} from './data/portfolioData';
import { fetchPortfolioData } from '../../api/portfolio/apiPortfolio';
import { DEFAULT_ADMIN } from '../../api/users/user';
import { ProjectCard } from './components/ProjectCard';
import { SkillCard } from './components/SkillCard';
import { ExperienceTable } from './components/ExperienceTable';

type Filter = 'All' | Skill['focus'];
const filters: Filter[] = ['All', 'Software', 'Hardware', 'Data', 'AI', 'Web'];

interface PortfolioProps {
    onNavigateAdmin?: () => void;
    darkMode?: boolean;
    onToggleDarkMode?: () => void;
}

export function Portfolio({ onNavigateAdmin, darkMode = false, onToggleDarkMode }: PortfolioProps) {
    const [filter, setFilter] = useState<Filter>('All');
    const [skillsList, setSkillsList] = useState<Skill[]>(fallbackSkills);
    const [experiencesList, setExperiencesList] = useState<Experience[]>(fallbackExperiences);
    const [projectsList, setProjectsList] = useState<Project[]>(fallbackProjects);

    useEffect(() => {
        fetchPortfolioData().then(({ data }) => {
            if (data) {
                if (data.skills && data.skills.length > 0) setSkillsList(data.skills);
                if (data.experiences && data.experiences.length > 0) setExperiencesList(data.experiences);
                if (data.projects && data.projects.length > 0) setProjectsList(data.projects);
            }
        });
    }, []);

    const visibleSkills = filter === 'All' ? skillsList : skillsList.filter((s) => s.focus === filter);

    return (
        <div className="min-h-screen transition-colors duration-200">
            {/* Top Navbar */}
            <nav className="border-b border-zinc-200/80 bg-white/80 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 font-bold text-white dark:bg-zinc-100 dark:text-zinc-900">
                            V
                        </span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">Baraclan.me</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onToggleDarkMode}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            title="Toggle Dark Mode"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {onNavigateAdmin && (
                            <button
                                type="button"
                                onClick={onNavigateAdmin}
                                className="flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                            >
                                <span>⚙️</span>
                                <span>Admin Dashboard</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Portfolio Content */}
            <main className="mx-auto max-w-5xl space-y-14 px-6 py-10">
                <header className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                        {DEFAULT_ADMIN.name}
                    </h1>
                    <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
                        Computer Engineering · Software, Embedded Systems & Full-Stack Development
                    </p>
                </header>

                {/* Projects Section */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Projects</h2>
                        <span className="text-xs text-zinc-400">{projectsList.length} items</span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {projectsList.map((p) => (
                            <ProjectCard key={p._id || p.name} project={p} />
                        ))}
                    </div>
                </section>

                {/* Skills Section */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Skills & Tech</h2>
                        <span className="text-xs text-zinc-400">{skillsList.length} skills</span>
                    </div>

                    <div className="mb-5 flex flex-wrap gap-2">
                        {filters.map((f) => (
                            <button
                                key={f}
                                type="button"
                                onClick={() => setFilter(f)}
                                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${filter === f
                                        ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
                                        : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {visibleSkills.map((s) => (
                            <SkillCard key={s._id || s.skillName} skill={s} />
                        ))}
                    </div>
                </section>

                {/* Experience Section */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Experience & Education</h2>
                        <span className="text-xs text-zinc-400">{experiencesList.length} milestones</span>
                    </div>
                    <ExperienceTable experiences={experiencesList} />
                </section>
            </main>
        </div>
    );
}

export default Portfolio;
