import React from 'react';
import type { Project } from '../../../../dataTypes/dataTypesPortfolio';

interface ProjectModalProps {
  isOpen: boolean;
  editingProject: Project | null;
  projectForm: Project;
  onFormChange: (form: Project) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function ProjectModal({
  isOpen,
  editingProject,
  projectForm,
  onFormChange,
  onClose,
  onSave,
}: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={projectForm.name}
              onChange={(e) => onFormChange({ ...projectForm, name: e.target.value })}
              placeholder="e.g. Smart IoT Gateway"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Role
              </label>
              <input
                type="text"
                value={projectForm.role}
                onChange={(e) => onFormChange({ ...projectForm, role: e.target.value })}
                placeholder="e.g. Hardware Lead"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Date / Year
              </label>
              <input
                type="text"
                value={projectForm.date}
                onChange={(e) => onFormChange({ ...projectForm, date: e.target.value })}
                placeholder="e.g. 2026"
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Tech Stack (comma-separated)
            </label>
            <input
              type="text"
              value={projectForm.techStack}
              onChange={(e) => onFormChange({ ...projectForm, techStack: e.target.value })}
              placeholder="React, TypeScript, ESP32, MongoDB"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Project Image URL
            </label>
            <input
              type="text"
              value={projectForm.img}
              onChange={(e) => onFormChange({ ...projectForm, img: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={3}
              value={projectForm.description}
              onChange={(e) => onFormChange({ ...projectForm, description: e.target.value })}
              placeholder="What does this project do and what problems does it solve?"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white hover:bg-violet-700"
            >
              Save Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
