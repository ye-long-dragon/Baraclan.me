import type { Project } from '../../../dataTypes/dataTypesPortfolio';

export function ProjectCard({ project }: { project: Project }) {
    const tags = project.techStack ? project.techStack.split(',').map((t) => t.trim()) : [];

    return (
        <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:hover:border-violet-500/60 dark:hover:shadow-violet-950/30">
            <div>
                {project.img ? (
                    <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                        <img
                            src={project.img}
                            alt={project.name}
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                ) : (
                    <div className="mb-4 flex h-32 w-full items-center justify-center rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 text-3xl font-extrabold text-violet-300 dark:from-zinc-800/80 dark:to-zinc-800/40 dark:text-zinc-600">
                        ⚡
                    </div>
                )}

                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
                        {project.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {project.date}
                    </span>
                </div>

                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    {project.role}
                </p>

                <p className="mt-3 text-sm text-zinc-600 leading-relaxed dark:text-zinc-300">
                    {project.description}
                </p>
            </div>

            {tags.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-lg bg-violet-50/80 px-2.5 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/80"
                        >
                            #{tag}
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}
