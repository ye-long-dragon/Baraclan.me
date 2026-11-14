import React from 'react';
import type { Skill } from '../../../../dataTypes/dataTypesPortfolio';

interface SkillModalProps {
  isOpen: boolean;
  editingSkill: Skill | null;
  skillForm: Skill;
  onFormChange: (form: Skill) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function SkillModal({
  isOpen,
  editingSkill,
  skillForm,
  onFormChange,
  onClose,
  onSave,
}: SkillModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={skillForm.skillName}
              onChange={(e) => onFormChange({ ...skillForm, skillName: e.target.value })}
              placeholder="e.g. React, Python, Embedded C++"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Focus Area
            </label>
            <select
              value={skillForm.focus}
              onChange={(e) =>
                onFormChange({
                  ...skillForm,
                  focus: e.target.value as 'Software' | 'Hardware' | 'Data' | 'AI' | 'Web',
                })
              }
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Web">Web</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Data">Data</option>
              <option value="AI">AI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Icon / Image URL
            </label>
            <input
              type="text"
              value={skillForm.img}
              onChange={(e) => onFormChange({ ...skillForm, img: e.target.value })}
              placeholder="https://... or leave empty"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={3}
              value={skillForm.descrip}
              onChange={(e) => onFormChange({ ...skillForm, descrip: e.target.value })}
              placeholder="Brief description of what you build with this..."
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
              Save Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
