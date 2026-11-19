import React from 'react';
import type { Experience } from '../../../../dataTypes/dataTypesPortfolio';

interface ExperienceModalProps {
  isOpen: boolean;
  editingExperience: Experience | null;
  experienceForm: Experience;
  onFormChange: (form: Experience) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function ExperienceModal({
  isOpen,
  editingExperience,
  experienceForm,
  onFormChange,
  onClose,
  onSave,
  isLoading = false,
}: ExperienceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl border border-gold/40 bg-navy p-6 shadow-2xl font-main text-gold my-8">
        <h3 className="font-name text-xl font-bold tracking-tight text-gold">
          {editingExperience ? 'Edit Experience' : 'Add New Experience'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
                Type *
              </label>
              <select
                value={experienceForm.type}
                onChange={(e) =>
                  onFormChange({
                    ...experienceForm,
                    type: e.target.value as 'Education' | 'Work',
                  })
                }
                className="mt-1 w-full rounded border border-gold/30 bg-navy px-3 py-2 text-sm text-sand focus:border-gold focus:outline-none"
              >
                <option value="Education" className="bg-navy text-sand">
                  Education
                </option>
                <option value="Work" className="bg-navy text-sand">
                  Work
                </option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
                Date / Period *
              </label>
              <input
                type="text"
                required
                value={experienceForm.date}
                onChange={(e) => onFormChange({ ...experienceForm, date: e.target.value })}
                placeholder="e.g. 2023 – Present"
                className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Company / University *
            </label>
            <input
              type="text"
              required
              value={experienceForm.company}
              onChange={(e) => onFormChange({ ...experienceForm, company: e.target.value })}
              placeholder="e.g. Mapua University or Acme Corp"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Degree / Title *
            </label>
            <input
              type="text"
              required
              value={experienceForm.subDescrip}
              onChange={(e) => onFormChange({ ...experienceForm, subDescrip: e.target.value })}
              placeholder="e.g. BS Computer Engineering"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={experienceForm.descrip}
              onChange={(e) => onFormChange({ ...experienceForm, descrip: e.target.value })}
              placeholder="Key responsibilities, achievements, coursework..."
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded border border-gold/40 px-4 py-2 text-xs uppercase tracking-wider text-gold transition hover:bg-gold/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded bg-gold px-5 py-2 text-xs uppercase tracking-widest font-bold text-navy transition hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : editingExperience ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
