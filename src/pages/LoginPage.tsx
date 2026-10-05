import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import { Cpu, ArrowRight, Sparkles, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useUIStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const ok = await login(email, password);
    if (ok) {
      showToast({ type: 'success', message: 'Signed in successfully' });
      navigate('/dashboard');
    }
  };

  const handleDemoSignIn = async (role: 'monish' | 'admin' | 'guest') => {
    const ok = await demoLogin(role);
    if (ok) {
      showToast({
        type: 'success',
        title: 'Demo Sign-In',
        message: `Welcome ${role === 'monish' ? 'Monish (PS3 Benchmark User)' : role === 'admin' ? 'Admin' : 'Guest'}!`,
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mx-auto flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Log in to SecondLife
          </h1>
          <p className="text-xs text-slate-400">
            Access your component inventory and project feasibility engine.
          </p>
        </div>

        {/* 1-Click Quick Demo Sign In Cards (Evaluator Friendly) */}
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Sign-In (1-Click)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoSignIn('monish')}
              className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-teal-500/30 hover:border-teal-400 rounded-lg text-left transition-all group"
            >
              <div className="font-semibold text-teal-300 group-hover:text-teal-200">
                Monish (PS3 Demo)
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Preloaded 6 benchmark components
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="p-2.5 bg-slate-950/60 hover:bg-slate-800/80 border border-orange-500/30 hover:border-orange-400 rounded-lg text-left transition-all group"
            >
              <div className="font-semibold text-orange-300 group-hover:text-orange-200">
                Admin Console
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Manage catalog & users
              </div>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="monish@secondlife.local"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-teal-500/20 disabled:opacity-50 text-xs"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In with Email'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="pt-2 text-center text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-400 hover:underline font-medium">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
