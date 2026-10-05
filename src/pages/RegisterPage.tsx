import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import { Cpu, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useUIStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const ok = await register(name, email, password);
    if (ok) {
      showToast({ type: 'success', message: 'Account registered successfully!' });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create SecondLife Account
          </h1>
          <p className="text-xs text-slate-400">
            Catalog your unused electronics and discover creative reuse builds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Maker Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Monish Nandha Balan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-teal-500/20 disabled:opacity-50 text-xs"
          >
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-teal-400 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
