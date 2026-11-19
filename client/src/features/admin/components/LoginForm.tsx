import React, { useState } from 'react';
import { PROFILE } from '../../../lib/profile';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await onLogin(email, password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-4 font-main text-gold">
      <div className="w-full max-w-md rounded-2xl border border-gold/30 bg-navy/90 p-8 shadow-2xl backdrop-blur">
        <div className="text-center">
          <h1 className="font-name text-3xl font-bold tracking-tight text-gold">
            Admin Control Center
          </h1>
          <p className="mt-2 font-sub text-xs text-sand/70">
            Sign in with your administrator credentials
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded border border-red-500/40 bg-red-900/20 p-3 text-center text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/30 focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-gold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1 w-full rounded border border-gold/30 bg-navy/60 px-3 py-2 text-sm text-sand placeholder:text-sand/30 focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded bg-gold py-3 font-main text-xs uppercase tracking-widest font-bold text-navy transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 border-t border-gold/20 pt-4 text-center">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="font-sub text-xs text-sand/60 transition hover:text-gold hover:underline"
          >
            GitHub: {PROFILE.github.replace('https://github.com/', '')}
          </a>
        </div>
      </div>
    </div>
  );
};
