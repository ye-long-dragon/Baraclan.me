import React from 'react';
import type { Skill } from '../../../../dataTypes/dataTypesPortfolio';
import { ImageDropzone } from '../ImageDropzone';

interface SkillModalProps {
  isOpen: boolean;
  editingSkill: Skill | null;
  skillForm: Skill;
  onFormChange: (form: Skill) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

const FOCUS_OPTIONS: Skill['focus'][] = ['Software', 'Hardware', 'Data', 'AI', 'Web'];

export function SkillModal({
  isOpen,
  editingSkill,
  skillForm,
  onFormChange,
  onClose,
  onSave,
  isLoading = false,
}: SkillModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl border border-gold/40 bg-navy p-6 shadow-2xl font-main text-gold my-8">
        <h3 className="font-name text-xl font-bold tracking-tight text-gold">
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={skillForm.skillName}
              onChange={(e) => onFormChange({ ...skillForm, skillName: e.target.value })}
              placeholder="e.g. Embedded C++"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Focus Domain *
            </label>
            <select
              value={skillForm.focus}
              onChange={(e) =>
                onFormChange({ ...skillForm, focus: e.target.value as Skill['focus'] })
              }
              className="mt-1 w-full rounded border border-gold/30 bg-navy px-3 py-2 text-sm text-sand focus:border-gold focus:outline-none"
            >
              {FOCUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-navy text-sand">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Image Dropzone with auto-resize/WebP compression */}
          <ImageDropzone
            value={skillForm.img}
            onChange={(val) => onFormChange({ ...skillForm, img: val })}
            label="Skill Icon/Badge (Drag & Drop or Pick PNG/JPEG/WebP)"
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={skillForm.descrip}
              onChange={(e) => onFormChange({ ...skillForm, descrip: e.target.value })}
              placeholder="Short description of your proficiency..."
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
              {isLoading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
