import type { Project } from '../../../dataTypes/dataTypesPortfolio';

export function ProjectCard({ project }: { project: Project }) {
    const tags = project.techStack ? project.techStack.split(',').map((t) => t.trim()) : [];

    return (
        <article className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            {project.img && (
                <img
                    src={project.img}
                    alt={project.name}
                    className="h-44 w-full rounded-xl object-cover"
                />
            )}
            <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{project.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {project.role} · {project.date}
                </p>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{project.description}</p>
            {tags.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}
