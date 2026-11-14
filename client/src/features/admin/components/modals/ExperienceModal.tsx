import React from 'react';
import type { Experience } from '../../../../dataTypes/dataTypesPortfolio';

interface ExperienceModalProps {
  isOpen: boolean;
  editingExp: Experience | null;
  expForm: Experience;
  onFormChange: (form: Experience) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function ExperienceModal({
  isOpen,
  editingExp,
  expForm,
  onFormChange,
  onClose,
  onSave,
}: ExperienceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {editingExp ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Type
            </label>
            <select
              value={expForm.type}
              onChange={(e) => onFormChange({ ...expForm, type: e.target.value as 'Education' | 'Work' })}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="Work">Work</option>
              <option value="Education">Education</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Company / Institution *
            </label>
            <input
              type="text"
              required
              value={expForm.company}
              onChange={(e) => onFormChange({ ...expForm, company: e.target.value })}
              placeholder="e.g. University / Tech Corp"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Sub-description / Degree / Role
            </label>
            <input
              type="text"
              value={expForm.subDescrip}
              onChange={(e) => onFormChange({ ...expForm, subDescrip: e.target.value })}
              placeholder="e.g. BS Computer Engineering / Software Intern"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Date / Range
            </label>
            <input
              type="text"
              value={expForm.date}
              onChange={(e) => onFormChange({ ...expForm, date: e.target.value })}
              placeholder="e.g. 2023 - Present"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              rows={3}
              value={expForm.descrip}
              onChange={(e) => onFormChange({ ...expForm, descrip: e.target.value })}
              placeholder="Details about responsibilities, coursework, or achievements..."
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
              Save Experience
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
