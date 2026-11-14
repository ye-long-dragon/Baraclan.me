import React from 'react';
import type { User } from '../../../../dataTypes/dataTypeUser';

interface UserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  userForm: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    role: 'admin' | 'user';
    img: string;
  };
  onFormChange: (form: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    role: 'admin' | 'user';
    img: string;
  }) => void;
  onClose: () => void;
  onSave: (e: React.FormEvent) => void;
}

export function UserModal({
  isOpen,
  editingUser,
  userForm,
  onFormChange,
  onClose,
  onSave,
}: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {editingUser ? 'Edit User Account' : 'Create New User Account'}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {editingUser ? 'Update account info or change password.' : 'Enter new user credentials.'}
        </p>

        <form onSubmit={onSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Full Name
            </label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => onFormChange({ ...userForm, name: e.target.value })}
              placeholder="e.g. Vince Lawrence"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={userForm.email}
              onChange={(e) => onFormChange({ ...userForm, email: e.target.value })}
              placeholder="user@example.com"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
            </label>
            <input
              type="password"
              value={userForm.password}
              onChange={(e) => onFormChange({ ...userForm, password: e.target.value })}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Re-enter Password
            </label>
            <input
              type="password"
              value={userForm.rePassword}
              onChange={(e) => onFormChange({ ...userForm, rePassword: e.target.value })}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Account Role
            </label>
            <select
              value={userForm.role}
              onChange={(e) => onFormChange({ ...userForm, role: e.target.value as 'admin' | 'user' })}
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={userForm.img}
              onChange={(e) => onFormChange({ ...userForm, img: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="mt-1 w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
            >
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
