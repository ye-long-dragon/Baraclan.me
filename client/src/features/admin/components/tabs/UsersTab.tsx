import type { User } from '../../../../dataTypes/dataTypeUser';

interface UsersTabProps {
  users: User[];
  loadingUsers: boolean;
  userSearch: string;
  onSearchChange: (search: string) => void;
  onOpenCreateUser: () => void;
  onOpenEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  defaultAdminEmail: string;
}

export function UsersTab({
  users,
  loadingUsers,
  userSearch,
  onSearchChange,
  onOpenCreateUser,
  onOpenEditUser,
  onDeleteUser,
  defaultAdminEmail,
}: UsersTabProps) {
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">User Accounts</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Manage login accounts with password encryption (bcrypt) and role-based access.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search accounts..."
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-violet-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="button"
            onClick={onOpenCreateUser}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
          >
            <span>+</span>
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-300">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <tr>
              <th className="px-6 py-4">Account User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loadingUsers ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  Loading accounts...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No accounts found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id || user.email} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.img ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            user.name || user.email
                          )}`
                        }
                        alt={user.email}
                        className="h-10 w-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                      />
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {user.name || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenEditUser(user)}
                        className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      {user.email !== defaultAdminEmail && (
                        <button
                          type="button"
                          onClick={() => onDeleteUser(user)}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/60 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
