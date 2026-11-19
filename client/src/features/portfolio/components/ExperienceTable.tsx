import type { Experience } from '../../../dataTypes/dataTypesPortfolio';

export function ExperienceTable({ experiences }: { experiences: Experience[] }) {
    return (
        <div className="mx-auto max-w-2xl">
            {experiences.map((exp, idx) => (
                <article
                    key={`${exp.company}-${exp.date}-${idx}`}
                    className="border-t border-current/20 py-8 text-center first:border-t-0 first:pt-0"
                >
                    <p className="font-main text-xs uppercase tracking-[0.25em] opacity-70">
                        {exp.type} · {exp.date}
                    </p>
                    <h3 className="font-main mt-2 text-2xl font-medium uppercase tracking-wide">
                        {exp.company}
                    </h3>
                    <p className="font-main mt-1 text-sm uppercase tracking-wider">{exp.subDescrip}</p>
                    <p className="font-sub mx-auto mt-3 max-w-lg text-sm leading-relaxed opacity-90">
                        {exp.descrip}
                    </p>
                </article>
            ))}
        </div>
    );
}