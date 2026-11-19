import React from 'react';
import type { Skill } from '../../../../dataTypes/dataTypesPortfolio';

interface SkillsTabProps {
  skills: Skill[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export const SkillsTab: React.FC<SkillsTabProps> = ({
  skills,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-name text-2xl font-bold tracking-tight text-gold">Skills</h2>
          <p className="font-sub text-xs text-sand/70">
            Manage your technical competencies and toolsets
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded bg-gold px-4 py-2 font-main text-xs uppercase tracking-widest font-bold text-navy transition hover:opacity-90"
        >
          + Add Skill
        </button>
      </div>

      {loading && skills.length === 0 ? (
        <div className="py-12 text-center text-sm text-gold/60 animate-pulse">
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="rounded-lg border border-gold/20 bg-navy/40 p-8 text-center text-sand/70">
          No skills found. Click "+ Add Skill" to add your first technical skill.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gold/20 bg-navy/50">
          <table className="w-full text-left font-main text-sm">
            <thead className="border-b border-gold/20 bg-navy/90 text-xs uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Badge / Icon</th>
                <th className="px-4 py-3">Skill Name</th>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-sand">
              {skills.map((skill, idx) => (
                <tr
                  key={skill.id || skill._id || `${skill.skillName}-${idx}`}
                  className="transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3">
                    {skill.img ? (
                      <img
                        src={skill.img}
                        alt={skill.skillName}
                        className="h-8 w-8 rounded object-contain border border-gold/20 p-0.5"
                      />
                    ) : (
                      <span className="text-xs text-sand/40">No icon</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">{skill.skillName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block rounded border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs text-gold">
                      {skill.focus}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-sm truncate text-xs text-sand/80">
                    {skill.descrip}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(skill)}
                      className="mr-3 text-xs uppercase tracking-wider text-gold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(skill)}
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
