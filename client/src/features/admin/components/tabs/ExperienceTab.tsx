import React from 'react';
import type { Experience } from '../../../../dataTypes/dataTypesPortfolio';

interface ExperienceTabProps {
  experiences: Experience[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (exp: Experience) => void;
  onDelete: (exp: Experience) => void;
}

export const ExperienceTab: React.FC<ExperienceTabProps> = ({
  experiences,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-name text-2xl font-bold tracking-tight text-gold">Experience</h2>
          <p className="font-sub text-xs text-sand/70">
            Manage your education, work history, and milestones
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded bg-gold px-4 py-2 font-main text-xs uppercase tracking-widest font-bold text-navy transition hover:opacity-90"
        >
          + Add Experience
        </button>
      </div>

      {loading && experiences.length === 0 ? (
        <div className="py-12 text-center text-sm text-gold/60 animate-pulse">
          Loading experience...
        </div>
      ) : experiences.length === 0 ? (
        <div className="rounded-lg border border-gold/20 bg-navy/40 p-8 text-center text-sand/70">
          No experience records found. Click "+ Add Experience" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gold/20 bg-navy/50">
          <table className="w-full text-left font-main text-sm">
            <thead className="border-b border-gold/20 bg-navy/90 text-xs uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Company / Institution</th>
                <th className="px-4 py-3">Role / Degree</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-sand">
              {experiences.map((exp, idx) => (
                <tr
                  key={exp.id || exp._id || `${exp.company}-${idx}`}
                  className="transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded border px-2 py-0.5 text-xs ${
                        exp.type === 'Education'
                          ? 'border-blue-400/40 bg-blue-500/10 text-blue-300'
                          : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300'
                      }`}
                    >
                      {exp.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">{exp.company}</td>
                  <td className="px-4 py-3">{exp.subDescrip}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{exp.date}</td>
                  <td className="px-4 py-3 max-w-sm truncate text-xs text-sand/80">
                    {exp.descrip}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(exp)}
                      className="mr-3 text-xs uppercase tracking-wider text-gold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(exp)}
                      className="text-xs uppercase tracking-wider text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
