import type { ReactNode } from 'react';

type Tone = 'navy' | 'sand';

const toneClasses: Record<Tone, string> = {
    navy: 'bg-navy text-gold',
    sand: 'bg-sand text-navy',
};

interface SectionProps {
    id?: string;
    tone: Tone;
    title: string;
    subtitle?: string;
    children: ReactNode;
}

export function Section({ id, tone, title, subtitle, children }: SectionProps) {
    return (
        <section id={id} className={`${toneClasses[tone]} scroll-mt-16 px-6 py-20`}>
            <div className="mx-auto max-w-5xl text-center">
                <h2 className="font-main text-3xl font-medium uppercase tracking-[0.2em] sm:text-4xl">
                    {title}
                </h2>
                <div className="mx-auto mt-4 h-0.5 w-16 bg-gold" />
                {subtitle && (
                    <p className="font-sub mx-auto mt-4 max-w-xl text-sm opacity-80">{subtitle}</p>
                )}
                <div className="mt-12">{children}</div>
            </div>
        </section>
    );
}