interface DatabaseTabProps {
  dbStatus: { connected: boolean; message: string };
  syncingMongo: boolean;
  onSyncToMongo: () => void;
}

export function DatabaseTab({ dbStatus, syncingMongo, onSyncToMongo }: DatabaseTabProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          MongoDB Atlas Configuration
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Connected database cluster from your local environment file (<code className="text-xs">.env</code>).
        </p>

        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-xs font-medium text-zinc-500">MongoDB Connection String</span>
            <p className="mt-1 font-mono text-xs text-zinc-800 dark:text-zinc-200">
              mongodb+srv://bvincelawrence_db_user:••••••••@portfolio.fs5ovxz.mongodb.net/portfolio
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs font-medium text-zinc-500">Database User</span>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                bvincelawrence_db_user
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs font-medium text-zinc-500">Cluster Name</span>
              <p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                portfolio.fs5ovxz.mongodb.net
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <span className="text-xs font-medium text-zinc-500">Live Status</span>
              <p
                className={`mt-1 text-sm font-semibold ${
                  dbStatus.connected ? 'text-emerald-600' : 'text-amber-500'
                }`}
              >
                {dbStatus.message}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={onSyncToMongo}
              disabled={syncingMongo}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {syncingMongo ? 'Syncing...' : 'Sync Current Portfolio State to MongoDB'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
