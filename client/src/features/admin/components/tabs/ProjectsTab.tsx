import React from 'react';
import type { Project } from '../../../../dataTypes/dataTypesPortfolio';

interface ProjectsTabProps {
  projects: Project[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  loading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-name text-2xl font-bold tracking-tight text-gold">Projects</h2>
          <p className="font-sub text-xs text-sand/70">
            Manage your showcase projects and case studies
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="rounded bg-gold px-4 py-2 font-main text-xs uppercase tracking-widest font-bold text-navy transition hover:opacity-90"
        >
          + Add Project
        </button>
      </div>

      {loading && projects.length === 0 ? (
        <div className="py-12 text-center text-sm text-gold/60 animate-pulse">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-gold/20 bg-navy/40 p-8 text-center text-sand/70">
          No projects found. Click "+ Add Project" to create your first project.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gold/20 bg-navy/50">
          <table className="w-full text-left font-main text-sm">
            <thead className="border-b border-gold/20 bg-navy/90 text-xs uppercase tracking-wider text-gold">
              <tr>
                <th className="px-4 py-3">Preview</th>
                <th className="px-4 py-3">Project Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Tech Stack</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 text-sand">
              {projects.map((project, idx) => (
                <tr
                  key={project.id || project._id || `${project.name}-${idx}`}
                  className="transition hover:bg-gold/5"
                >
                  <td className="px-4 py-3">
                    {project.img ? (
                      <img
                        src={project.img}
                        alt={project.name}
                        className="h-10 w-16 rounded object-cover border border-gold/20"
                      />
                    ) : (
                      <span className="text-xs text-sand/40">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gold">{project.name}</td>
                  <td className="px-4 py-3">{project.role}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{project.date}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-xs text-sand/80">
                    {project.techStack}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(project)}
                      className="mr-3 text-xs uppercase tracking-wider text-gold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(project)}
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
