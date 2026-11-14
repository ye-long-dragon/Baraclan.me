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
        <div className="min-h-screen transition-colors duration-300">
            {/* Top Navbar */}
            <nav className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-white shadow-md shadow-violet-500/20">
                            V
                        </span>
                        <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Baraclan.me
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onToggleDarkMode}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            title="Toggle Dark Mode"
                        >
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {onNavigateAdmin && (
                            <button
                                type="button"
                                onClick={onNavigateAdmin}
                                className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                <span>⚙️</span>
                                <span>Admin Dashboard</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Portfolio Content */}
            <main className="mx-auto max-w-5xl space-y-16 px-6 py-12">
                {/* 1. HERO SECTION (Picture Left, Details Right) */}
                <section className="flex flex-col items-center gap-8 rounded-3xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50/70 via-white to-zinc-50/40 p-8 shadow-sm md:flex-row md:items-center md:gap-12 md:p-10 dark:border-zinc-800/80 dark:from-zinc-900/60 dark:via-zinc-900/40 dark:to-zinc-900/20">
                    {/* Picture Left Side */}
                    <div className="relative shrink-0">
                        <div className="animate-glow rounded-3xl p-1 bg-gradient-to-tr from-violet-600 via-indigo-500 to-amber-400">
                            <img
                                src={DEFAULT_ADMIN.img || 'https://avatars.githubusercontent.com/u/158171645?v=4'}
                                alt={DEFAULT_ADMIN.name}
                                className="animate-float h-36 w-36 rounded-[22px] object-cover shadow-2xl md:h-44 md:w-44"
                            />
                        </div>
                        {/* Live status badge */}
                        <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 rounded-full border border-white/80 bg-white px-2.5 py-1 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">
                                Open to Work
                            </span>
                        </div>
                    </div>

                    {/* Details Right Side */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-300">
                            <span>👋 Welcome to my portfolio</span>
                        </div>

                        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                            {DEFAULT_ADMIN.name}
                        </h1>

                        <p className="mt-2 text-lg font-medium text-violet-600 dark:text-violet-400">
                            Computer Engineering · Software, Embedded Systems & Full-Stack Development
                        </p>

                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                            Passionate about bridging hardware and software. Building responsive web applications, firmware for microcontrollers, and performant embedded architectures.
                        </p>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                            <a
                                href="#projects"
                                className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg"
                            >
                                Explore Projects ↓
                            </a>
                            <a
                                href="https://github.com/ye-long-dragon"
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-bold text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                            >
                                GitHub Profile ↗
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. PROJECTS SECTION (Indigo / Violet Theme Accent) */}
                <section id="projects" className="scroll-mt-24 space-y-6">
                    <div className="flex items-center justify-between border-b border-indigo-200/50 pb-4 dark:border-indigo-950/50">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-400">
                                🚀
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Featured Projects
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Software solutions, hardware designs, and full-stack systems
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                            {projectsList.length} total
                        </span>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        {projectsList.map((p) => (
                            <ProjectCard key={p._id || p.name} project={p} />
                        ))}
                    </div>
                </section>

                {/* 3. SKILLS SECTION (Emerald / Tech Theme Accent) */}
                <section id="skills" className="scroll-mt-24 space-y-6">
                    <div className="flex flex-col gap-4 border-b border-emerald-200/50 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-950/50">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400">
                                ⚡
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Skills & Technologies
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Core languages, engineering frameworks, and hardware toolsets
                                </p>
                            </div>
                        </div>

                        {/* Interactive Filter Pills with Animated Highlight */}
                        <div className="flex flex-wrap gap-1.5">
                            {filters.map((f) => {
                                const isActive = filter === f;
                                return (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => setFilter(f)}
                                        className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 ${
                                            isActive
                                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                                                : 'border border-zinc-200 bg-white text-zinc-600 hover:border-emerald-300 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-emerald-700 dark:hover:text-emerald-300'
                                        }`}
                                    >
                                        {f}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleSkills.map((s) => (
                            <SkillCard key={s._id || s.skillName} skill={s} />
                        ))}
                    </div>
                </section>

                {/* 4. EXPERIENCE SECTION (Sky / Blue Theme Accent) */}
                <section id="experience" className="scroll-mt-24 space-y-6">
                    <div className="flex items-center justify-between border-b border-sky-200/50 pb-4 dark:border-sky-950/50">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-400">
                                📜
                            </span>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Experience & Education
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    Academic background and professional milestones
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">
                            {experiencesList.length} milestones
                        </span>
                    </div>

                    <ExperienceTable experiences={experiencesList} />
                </section>
            </main>
        </div>
    );
}

export default Portfolio;
