import type { Skill } from '../../../dataTypes/dataTypesPortfolio';

const focusStyles: Record<Skill['focus'], { bg: string; text: string; badge: string; border: string }> = {
    Software: {
        bg: 'from-violet-500/10 to-indigo-500/5',
        text: 'text-violet-600 dark:text-violet-400',
        badge: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
        border: 'hover:border-violet-400 dark:hover:border-violet-500',
    },
    Hardware: {
        bg: 'from-amber-500/10 to-orange-500/5',
        text: 'text-amber-600 dark:text-amber-400',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
        border: 'hover:border-amber-400 dark:hover:border-amber-500',
    },
    Data: {
        bg: 'from-emerald-500/10 to-teal-500/5',
        text: 'text-emerald-600 dark:text-emerald-400',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
        border: 'hover:border-emerald-400 dark:hover:border-emerald-500',
    },
    AI: {
        bg: 'from-rose-500/10 to-pink-500/5',
        text: 'text-rose-600 dark:text-rose-400',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
        border: 'hover:border-rose-400 dark:hover:border-rose-500',
    },
    Web: {
        bg: 'from-cyan-500/10 to-blue-500/5',
        text: 'text-cyan-600 dark:text-cyan-400',
        badge: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
        border: 'hover:border-cyan-400 dark:hover:border-cyan-500',
    },
};

export function SkillCard({ skill }: { skill: Skill }) {
    const style = focusStyles[skill.focus] || focusStyles.Web;

    return (
        <article
            className={`group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800/80 dark:bg-zinc-900/90 ${style.border}`}
        >
            {/* Subtle background glow gradient on hover */}
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.bg} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            {skill.img ? (
                <img
                    src={skill.img}
                    alt={skill.skillName}
                    className="relative h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 font-bold text-lg shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-zinc-800 ${style.text}`}
                >
                    {skill.skillName[0]}
                </div>
            )}

            <div className="relative flex-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{skill.skillName}</h3>
                    <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide ${style.badge}`}>
                        {skill.focus}
                    </span>
                </div>
                <p className="mt-1 text-xs text-zinc-600 leading-relaxed dark:text-zinc-300">{skill.descrip}</p>
            </div>
        </article>
    );
}
