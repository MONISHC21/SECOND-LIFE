import React, { useEffect, useState } from 'react';
import { api } from '../services/api.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import { StatCard } from '../components/common/StatCard.tsx';
import {
  Shield,
  Users,
  Cpu,
  BookOpen,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Award,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'components' | 'projects'>('overview');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [componentsList, setComponentsList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New component form
  const [compName, setCompName] = useState('');
  const [compCategory, setCompCategory] = useState('Sensors');
  const [compDesc, setCompDesc] = useState('');
  const [compWeight, setCompWeight] = useState(25);
  const [compCO2, setCompCO2] = useState(180);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [uRes, aRes, cRes, pRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminAnalytics(),
        api.getComponents({ limit: 100 }),
        api.getProjects(),
      ]);

      if (uRes.success) setUsersList(uRes.data.users);
      if (aRes.success) setAnalytics(aRes.data.analytics);
      if (cRes.success) setComponentsList(cRes.data.components);
      if (pRes.success) setProjectsList(pRes.data.projects);
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to load admin telemetry' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await api.updateAdminUserRole(userId, newRole);
      if (res.success) {
        showToast({ type: 'success', message: res.message });
        loadData();
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Delete user "${userName}"?`)) {
      try {
        const res = await api.deleteAdminUser(userId);
        if (res.success) {
          showToast({ type: 'info', message: res.message });
          loadData();
        }
      } catch (err: any) {
        showToast({ type: 'error', message: err.message });
      }
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;

    try {
      const res = await api.createComponent({
        name: compName.trim(),
        category: compCategory,
        description: compDesc.trim(),
        estimatedWeightGrams: compWeight,
        estimatedCO2Grams: compCO2,
      });

      if (res.success) {
        showToast({ type: 'success', message: 'New component added to catalog' });
        setCompName('');
        setCompDesc('');
        loadData();
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-orange-400 mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Administration & Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            SecondLife Control Console
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage user accounts, master component catalog, and predefined project blueprints.
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-slate-800 text-orange-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'users' ? 'bg-slate-800 text-orange-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Users ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
            activeTab === 'components' ? 'bg-slate-800 text-orange-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Catalog ({componentsList.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Registered Users"
              value={analytics.totalUsers}
              unit="accounts"
              icon={Users}
              accent="orange"
            />
            <StatCard
              title="Master Components"
              value={analytics.totalComponents}
              unit="part types"
              icon={Cpu}
              accent="teal"
            />
            <StatCard
              title="Project Blueprints"
              value={analytics.totalProjects}
              unit="blueprints"
              icon={BookOpen}
              accent="emerald"
            />
            <StatCard
              title="Total Reused Mass"
              value={analytics.totalWasteSavedGrams}
              unit="grams"
              subtitle="All user inventories"
              icon={Award}
              accent="teal"
            />
          </div>

          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 text-xs">
            <h3 className="text-sm font-semibold text-white">System Architecture & Rules</h3>
            <p className="text-slate-400 leading-relaxed">
              SecondLife operates with role-based access control (GUEST, USER, ADMIN). JWT tokens verify requests via the Bearer protocol. All inventory modifications trigger instant deterministic feasibility calculations across all 10 predefined projects without background polling.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">Hardware Units</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{u.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {u.email}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center font-mono tabular-nums text-teal-300">
                    {u.totalComponentsOwned || 0} pcs
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id, u.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Catalog Management */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          {/* Add New Master Component Form */}
          <form
            onSubmit={handleCreateComponent}
            className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 text-xs"
          >
            <h3 className="font-semibold text-white">Add Master Catalog Component</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Component Name (e.g. Raspberry Pi Pico W)"
                value={compName}
                onChange={(e) => setCompName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                required
              />
              <select
                value={compCategory}
                onChange={(e) => setCompCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
              >
                <option value="Microcontrollers">Microcontrollers</option>
                <option value="Sensors">Sensors</option>
                <option value="Motors">Motors</option>
                <option value="Displays">Displays</option>
                <option value="Power">Power</option>
                <option value="Modules">Modules</option>
                <option value="Passive Components">Passive Components</option>
                <option value="Tools">Tools</option>
              </select>
              <input
                type="text"
                placeholder="Short Description"
                value={compDesc}
                onChange={(e) => setCompDesc(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-white"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-orange-400 text-slate-950 font-semibold hover:bg-orange-300 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Master Catalog</span>
              </button>
            </div>
          </form>

          {/* Master Catalog Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">CO₂ Footprint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {componentsList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-850/30">
                    <td className="py-2.5 px-3 font-medium text-white">{c.name}</td>
                    <td className="py-2.5 px-3 text-slate-400">{c.category}</td>
                    <td className="py-2.5 px-3 text-teal-400 font-mono tabular-nums">{c.estimatedWeightGrams}g</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-mono tabular-nums">{c.estimatedCO2Grams}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
