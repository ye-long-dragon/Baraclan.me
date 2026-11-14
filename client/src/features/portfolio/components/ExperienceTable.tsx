import type { Experience } from '../../../dataTypes/dataTypesPortfolio';

export function ExperienceTable({ experiences }: { experiences: Experience[] }) {
    return (
        <div className="relative space-y-4">
            {experiences.map((exp, idx) => {
                const isEducation = exp.type === 'Education';

                return (
                    <article
                        key={exp._id || `${exp.company}-${exp.date}-${idx}`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center dark:border-zinc-800/80 dark:bg-zinc-900/90"
                    >
                        {/* Left edge colored accent line */}
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2 ${
                                isEducation ? 'bg-sky-500' : 'bg-emerald-500'
                            }`}
                        />

                        <div className="pl-2 space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                        isEducation
                                            ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    }`}
                                >
                                    {exp.type}
                                </span>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                    {exp.company}
                                </h3>
                                <span className="text-xs font-medium text-zinc-400">· {exp.date}</span>
                            </div>

                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                {exp.subDescrip}
                            </p>
                            <p className="text-xs text-zinc-500 leading-relaxed dark:text-zinc-400">
                                {exp.descrip}
                            </p>
                        </div>

                        <div className="mt-3 pl-2 sm:mt-0 sm:pl-0 shrink-0">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-colors">
                                {isEducation ? '🎓 Degree / Study' : '💼 Work Experience'}
                            </span>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
