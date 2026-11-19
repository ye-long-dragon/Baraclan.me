import React from 'react';
import type { Project } from '../../../../dataTypes/dataTypesPortfolio';
import { ImageDropzone } from '../ImageDropzone';

interface ProjectModalProps {
  isOpen: boolean;
  editingProject: Project | null;
  projectForm: Project;
  onFormChange: (form: Project) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export function ProjectModal({
  isOpen,
  editingProject,
  projectForm,
  onFormChange,
  onClose,
  onSave,
  isLoading = false,
}: ProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl border border-gold/40 bg-navy p-6 shadow-2xl font-main text-gold my-8">
        <h3 className="font-name text-xl font-bold tracking-tight text-gold">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h3>
        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={projectForm.name}
              onChange={(e) => onFormChange({ ...projectForm, name: e.target.value })}
              placeholder="e.g. Smart IoT Gateway"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
                Role *
              </label>
              <input
                type="text"
                required
                value={projectForm.role}
                onChange={(e) => onFormChange({ ...projectForm, role: e.target.value })}
                placeholder="e.g. Hardware Lead"
                className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
                Date / Year *
              </label>
              <input
                type="text"
                required
                value={projectForm.date}
                onChange={(e) => onFormChange({ ...projectForm, date: e.target.value })}
                placeholder="e.g. 2026"
                className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Tech Stack (comma-separated) *
            </label>
            <input
              type="text"
              required
              value={projectForm.techStack}
              onChange={(e) => onFormChange({ ...projectForm, techStack: e.target.value })}
              placeholder="React, TypeScript, ESP32, KiCad"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/40 focus:border-gold focus:outline-none"
            />
          </div>

          {/* Image Dropzone with auto-resize/WebP compression */}
          <ImageDropzone
            value={projectForm.img}
            onChange={(val) => onFormChange({ ...projectForm, img: val })}
            label="Project Image (Drag & Drop or Pick PNG/JPEG/WebP)"
          />

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={projectForm.description}
              onChange={(e) => onFormChange({ ...projectForm, description: e.target.value })}
              placeholder="Detailed description of the project..."
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
              {isLoading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
