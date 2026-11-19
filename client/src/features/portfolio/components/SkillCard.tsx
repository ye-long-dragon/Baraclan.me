import type { Skill } from '../../../dataTypes/dataTypesPortfolio';

export function SkillCard({ skill }: { skill: Skill }) {
    return (
        <article className="flex flex-col items-center text-center">
            {skill.img ? (
                <img
                    src={skill.img}
                    alt={skill.skillName}
                    className="mb-3 h-14 w-14 rounded-full object-cover"
                />
            ) : (
                <span className="font-main mb-3 text-4xl font-medium">{skill.skillName[0]}</span>
            )}
            <h3 className="font-main text-lg font-medium uppercase tracking-wide">{skill.skillName}</h3>
            <p className="font-main mt-1 text-[11px] uppercase tracking-[0.25em] opacity-70">
                {skill.focus}
            </p>
            <p className="font-sub mt-2 max-w-xs text-sm opacity-90">{skill.descrip}</p>
        </article>
    );
}