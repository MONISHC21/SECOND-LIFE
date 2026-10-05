import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.ts';
import {
  LayoutDashboard,
  Cpu,
  Sparkles,
  BookOpen,
  Leaf,
  Shield,
  Heart,
  Settings,
  Layers,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const navLinks = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/inventory', label: 'My Components', icon: Cpu },
    { to: '/recommendations', label: 'Matching Engine', icon: Sparkles, badge: 'Live' },
    { to: '/projects', label: 'Project Library', icon: BookOpen },
    { to: '/sustainability', label: 'Sustainability Impact', icon: Leaf },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0B1220] border-r border-slate-800/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-lg flex items-center gap-3">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'maker'}`}
            alt={user?.name}
            className="w-9 h-9 rounded-md bg-slate-800 border border-slate-700 p-0.5"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'ADMIN' ? 'bg-orange-400' : 'bg-teal-400'}`} />
              <span className="capitalize">{user?.role?.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Primary Workspace Navigation */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2">
            Maker Workspace
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono uppercase text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-800/50">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Admin Management Section (if role is ADMIN) */}
        {user?.role === 'ADMIN' && (
          <div className="pt-4 border-t border-slate-800/80 space-y-1">
            <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-orange-400/80 mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Platform Administration</span>
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`
              }
            >
              <Shield className="w-4 h-4 text-orange-400" />
              <span>Admin Management</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer System Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col gap-1">
        <div className="flex items-center justify-between font-mono">
          <span>Matching Engine</span>
          <span className="text-teal-400">Rule-Based v1</span>
        </div>
        <div className="text-[10px] text-slate-600">
          TechTrove 3.0 · PS3
        </div>
      </div>
    </aside>
  );
};
