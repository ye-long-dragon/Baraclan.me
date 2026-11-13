import type { Experience } from '../../../dataTypes/dataTypesPortfolio';

export function ExperienceTable({ experiences }: { experiences: Experience[] }) {
    return (
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {experiences.map((exp) => (
                <li
                    key={exp._id || `${exp.company}-${exp.date}`}
                    className="grid gap-2 p-5 sm:grid-cols-[10rem_1fr]"
                >
                    <div className="text-sm">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{exp.date}</p>
                        <span
                            className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                                exp.type === 'Education'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            }`}
                        >
                            {exp.type}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{exp.company}</h3>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{exp.subDescrip}</p>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{exp.descrip}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
