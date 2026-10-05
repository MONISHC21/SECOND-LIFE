import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import {
  Cpu,
  Layers,
  Sparkles,
  Leaf,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, demoLogin } = useAuthStore();
  const { showToast } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const handleDemoSwitch = async (role: 'monish' | 'admin' | 'guest') => {
    setDemoMenuOpen(false);
    const success = await demoLogin(role);
    if (success) {
      showToast({
        type: 'success',
        title: 'Demo Profile Switched',
        message: `Active session: ${role === 'monish' ? 'Monish (Student Maker)' : role === 'admin' ? 'Parameshwaran (Admin)' : 'Guest Maker'}`,
      });
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    showToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been signed out of your session',
    });
    navigate('/');
  };

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1220]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/20 transition-colors">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">
            Second<span className="text-teal-400">Life</span>
          </span>
        </Link>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <Link
            to="/projects"
            className={`transition-colors hover:text-white ${isCurrent('/projects') ? 'text-teal-400' : ''}`}
          >
            Project Library
          </Link>
          <Link
            to="/recommendations"
            className={`transition-colors hover:text-white flex items-center gap-1.5 ${isCurrent('/recommendations') ? 'text-teal-400' : ''}`}
          >
            <span>Matching Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </Link>
          <Link
            to="/sustainability"
            className={`transition-colors hover:text-white ${isCurrent('/sustainability') ? 'text-teal-400' : ''}`}
          >
            Sustainability
          </Link>
          {isAuthenticated && (
            <Link
              to="/inventory"
              className={`transition-colors hover:text-white ${isCurrent('/inventory') ? 'text-teal-400' : ''}`}
            >
              My Inventory
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`transition-colors hover:text-white flex items-center gap-1 text-orange-400 ${isCurrent('/admin') ? 'text-orange-300 font-semibold' : ''}`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        {/* Zone 3: Actions & Demo Switcher */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-md transition-colors"
              title="Switch demo persona for testing"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="hidden sm:inline">Demo:</span>
              <span className="text-teal-300 font-semibold truncate max-w-[90px]">
                {user?.role === 'ADMIN' ? 'Admin' : user ? user.name.split(' ')[0] : 'Monish'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {demoMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-800 shadow-xl py-1.5 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Persona (1-Click)
                </div>
                <button
                  onClick={() => handleDemoSwitch('monish')}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-teal-300">Monish (Student Maker)</div>
                    <div className="text-[11px] text-slate-400">ESP32, HC-SR04, Motors (PS3 Demo)</div>
                  </div>
                  {user?.id === 'usr_monish_01' && <span className="text-teal-400 font-mono">✓</span>}
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-orange-300">Parameshwaran (Admin)</div>
                    <div className="text-[11px] text-slate-400">Full Catalog & User Management</div>
                  </div>
                  {user?.role === 'ADMIN' && <span className="text-orange-400 font-mono">✓</span>}
                </button>
                <button
                  onClick={() => handleDemoSwitch('guest')}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-slate-300">Guest Maker</div>
                    <div className="text-[11px] text-slate-400">Empty initial sandbox</div>
                  </div>
                  {user?.role === 'GUEST' && <span className="text-slate-400 font-mono">✓</span>}
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1220] bg-teal-400 hover:bg-teal-300 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-teal-500/20"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-[#0B1220] bg-teal-400 hover:bg-teal-300 rounded-md transition-colors whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
          <Link
            to="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-teal-400"
          >
            Project Library
          </Link>
          <Link
            to="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-teal-400"
          >
            Matching Engine
          </Link>
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-teal-400"
          >
            My Inventory
          </Link>
          <Link
            to="/sustainability"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-300 hover:text-teal-400"
          >
            Sustainability
          </Link>
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-orange-400 font-semibold"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
