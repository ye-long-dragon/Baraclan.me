import { useState } from 'react';
import type { Skill } from '../../dataTypes/dataTypesPortfolio';
import { useProjects } from './hooks/useProjects';
import { useSkills } from './hooks/useSkills';
import { useExperiences } from './hooks/useExperiences';
import { PROFILE, AVATAR_FALLBACK } from '../../lib/profile';
import { Section } from './components/Section';
import { ProjectCard } from './components/ProjectCard';
import { SkillCard } from './components/SkillCard';
import { ExperienceTable } from './components/ExperienceTable';

type Filter = 'All' | Skill['focus'];
const filters: Filter[] = ['All', 'Software', 'Hardware', 'Data', 'AI', 'Web'];

const socialLinks = [
    { label: 'LinkedIn', href: PROFILE.linkedin },
    { label: 'GitHub', href: PROFILE.github },
    { label: 'Facebook', href: PROFILE.facebook },
    { label: 'Gmail', href: `mailto:${PROFILE.email}` },
];

interface PortfolioProps {
    onNavigateAdmin?: () => void;
}

export function Portfolio({ onNavigateAdmin }: PortfolioProps) {
    const [filter, setFilter] = useState<Filter>('All');
    const { items: skillsList } = useSkills();
    const { items: experiencesList } = useExperiences();
    const { items: projectsList } = useProjects();

    const visibleSkills =
        filter === 'All' ? skillsList : skillsList.filter((s) => s.focus === filter);

    return (
        <div className="min-h-screen bg-navy font-main text-gold">
            {/* Top bar */}
            <nav className="sticky top-0 z-40 border-b border-gold/20 bg-navy/95 backdrop-blur">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <span className="font-name text-lg font-bold tracking-tight">{PROFILE.name}</span>
                    <div className="font-main hidden gap-6 text-xs uppercase tracking-[0.2em] sm:flex">
                        <a href="#projects" className="hover:opacity-70">Projects</a>
                        <a href="#skills" className="hover:opacity-70">Skills</a>
                        <a href="#experience" className="hover:opacity-70">Experience</a>
                        <a href="#contact" className="hover:opacity-70">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero: navy bg, gold text */}
            <header className="bg-navy px-6 pb-24 pt-20 text-center text-gold">
                <img
                    src={PROFILE.img || AVATAR_FALLBACK}
                    alt={PROFILE.name}
                    className="animate-float mx-auto h-40 w-40 rounded-full object-cover ring-2 ring-gold ring-offset-4 ring-offset-navy"
                />
                <h1 className="font-name mt-8 text-5xl font-bold tracking-tight sm:text-6xl">
                    {PROFILE.name}
                </h1>
                <p className="font-main mt-4 text-lg uppercase tracking-[0.25em]">{PROFILE.title}</p>
                <p className="font-main mt-1 text-sm uppercase tracking-[0.2em] opacity-80">
                    {PROFILE.subtitle}
                </p>
                <p className="font-sub mx-auto mt-6 max-w-xl text-sm leading-relaxed opacity-90">
                    {PROFILE.bio}
                </p>
                <p className="font-main mt-6 text-xs uppercase tracking-[0.25em] opacity-80">
                    ● Open to work
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                    <a
                        href="#projects"
                        className="font-main bg-gold px-6 py-2.5 text-sm font-medium uppercase tracking-widest text-navy transition hover:opacity-90"
                    >
                        Explore Projects
                    </a>
                    <a
                        href={PROFILE.github}
                        target="_blank"
                        rel="noreferrer"
                        className="font-main text-sm uppercase tracking-widest underline underline-offset-4 hover:opacity-70"
                    >
                        GitHub Profile
                    </a>
                </div>
            </header>

            {/* Projects: sand bg, navy text */}
            <Section
                id="projects"
                tone="sand"
                title="Projects"
                subtitle="Software solutions, hardware designs, and full-stack systems"
            >
                <div className="grid gap-14 md:grid-cols-2">
                    {projectsList.map((p) => (
                        <ProjectCard key={p.id || p._id || p.name} project={p} />
                    ))}
                </div>
            </Section>

            {/* Skills: navy bg, gold text */}
            <Section
                id="skills"
                tone="navy"
                title="Skills"
                subtitle="Core languages, engineering frameworks, and hardware toolsets"
            >
                <div className="font-main mb-12 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm uppercase tracking-[0.2em]">
                    {filters.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setFilter(f)}
                            className={`pb-1 transition ${filter === f ? 'border-b-2 border-gold' : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleSkills.map((s) => (
                        <SkillCard key={s.id || s._id || s.skillName} skill={s} />
                    ))}
                </div>
            </Section>

            {/* Experience: sand bg, navy text */}
            <Section
                id="experience"
                tone="sand"
                title="Experience & Education"
                subtitle="Academic background and professional milestones"
            >
                <ExperienceTable experiences={experiencesList} />
            </Section>

            {/* Footer: navy bg, gold text */}
            <footer id="contact" className="border-t border-gold/20 bg-navy px-6 py-16 text-center text-gold">
                <h2 className="font-main text-3xl font-medium uppercase tracking-[0.2em]">Get in touch</h2>
                <div className="mx-auto mt-4 h-0.5 w-16 bg-gold" />
                <nav
                    aria-label="Social links"
                    className="font-main mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm uppercase tracking-[0.2em]"
                >
                    {socialLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                            rel="noreferrer"
                            className="underline-offset-4 hover:underline"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                <p className="font-sub mt-10 text-xs opacity-70">
                    © {new Date().getFullYear()} {PROFILE.name}
                </p>
                {onNavigateAdmin && (
                    <button
                        type="button"
                        onClick={onNavigateAdmin}
                        className="font-main mt-3 text-[10px] uppercase tracking-[0.25em] opacity-40 hover:opacity-80"
                    >
                        Admin
                    </button>
                )}
            </footer>
        </div>
    );
}

export default Portfolio;
