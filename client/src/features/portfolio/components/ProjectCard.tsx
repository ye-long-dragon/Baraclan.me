import type { Project } from '../../../dataTypes/dataTypesPortfolio';

export function ProjectCard({ project }: { project: Project }) {
    const tags = project.techStack
        ? project.techStack.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

    return (
        <article className="flex flex-col items-center text-center">
            {project.img && (
                <img
                    src={project.img}
                    alt={project.name}
                    className="mb-5 h-48 w-full max-w-sm rounded-lg object-cover"
                />
            )}
            <h3 className="font-main text-2xl font-medium uppercase tracking-wide">{project.name}</h3>
            <p className="font-main mt-1 text-xs uppercase tracking-[0.2em] opacity-70">
                {project.role} · {project.date}
            </p>
            <p className="font-sub mt-3 max-w-md text-sm leading-relaxed opacity-90">
                {project.description}
            </p>
            {tags.length > 0 && (
                <p className="font-main mt-4 text-xs uppercase tracking-widest opacity-70">
                    {tags.join(' · ')}
                </p>
            )}
        </article>
    );
}