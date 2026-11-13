import type { Skill } from '../../../dataTypes/dataTypesPortfolio';

export function SkillCard({ skill }: { skill: Skill }) {
    return (
        <article className="flex gap-3.5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900">
            {skill.img ? (
                <img
                    src={skill.img}
                    alt={skill.skillName}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                />
            ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-lg font-bold text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
                    {skill.skillName[0]}
                </div>
            )}
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{skill.skillName}</h3>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {skill.focus}
                    </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">{skill.descrip}</p>
            </div>
        </article>
    );
}
