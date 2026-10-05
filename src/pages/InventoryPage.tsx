import React, { useEffect, useState } from 'react';
import { useInventoryStore } from '../store/useInventoryStore.ts';
import { useUIStore } from '../store/useUIStore.ts';
import {
  Cpu,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  MapPin,
  Check,
} from 'lucide-react';
import { ComponentCondition } from '../types/index.ts';

export const InventoryPage: React.FC = () => {
  const { items, categories, stats, fetchInventory, updateItem, deleteItem, resetDemoInventory, isLoading } =
    useInventoryStore();
  const { openAddComponentModal, showToast } = useUIStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Filtering
  const filteredItems = items.filter((item) => {
    const comp = item.component;
    if (!comp) return false;

    const matchesSearch =
      comp.name.toLowerCase().includes(search.toLowerCase()) ||
      comp.category.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || comp.category === selectedCategory;
    const matchesCond = selectedCondition === 'All' || item.condition === selectedCondition;

    return matchesSearch && matchesCat && matchesCond;
  });

  const handleStartEdit = (id: string, currentQty: number) => {
    setEditingId(id);
    setEditQuantity(currentQty);
  };

  const handleSaveEdit = async (id: string) => {
    const ok = await updateItem(id, { quantity: Math.max(1, editQuantity) });
    if (ok) {
      showToast({ type: 'success', message: 'Quantity updated' });
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from your inventory?`)) {
      const ok = await deleteItem(id);
      if (ok) {
        showToast({ type: 'info', message: `Removed ${name} from inventory` });
      }
    }
  };

  const handleResetBenchmark = async () => {
    setIsResetting(true);
    await resetDemoInventory();
    setIsResetting(false);
    showToast({
      type: 'success',
      title: 'Benchmark Reset',
      message: 'Restored Monish scenario (ESP32, HC-SR04, DC Motors, 18650 Battery, Servo, DHT11)',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-1">
            Component Stock Management
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            My Electronic Components
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registered components available for matching against project requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetBenchmark}
            disabled={isResetting}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
            title="Reset to benchmark components"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={() => openAddComponentModal()}
            className="px-3.5 py-1.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors text-xs flex items-center gap-1.5 shadow-sm shadow-teal-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Component</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by component name, category, drawer, notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 font-sans"
          >
            <option value="All">All Categories</option>
            <option value="Microcontrollers">Microcontrollers</option>
            <option value="Sensors">Sensors</option>
            <option value="Motors">Motors</option>
            <option value="Displays">Displays</option>
            <option value="Power">Power</option>
            <option value="Modules">Modules</option>
            <option value="Passive Components">Passive Components</option>
            <option value="Tools">Tools</option>
          </select>

          {/* Condition Filter */}
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 font-sans"
          >
            <option value="All">All Conditions</option>
            <option value="GOOD">Good</option>
            <option value="NEW">New</option>
            <option value="USED">Used</option>
            <option value="DAMAGED">Damaged</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-medium font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Component Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Condition</th>
                <th className="py-3 px-4 text-center">Quantity</th>
                <th className="py-3 px-4">Location / Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => {
                const isEditing = editingId === item.id;
                const comp = item.component;

                return (
                  <tr key={item.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">
                        {comp?.name || item.componentId}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {comp?.description}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-300 font-medium">
                        {comp?.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          item.condition === 'NEW'
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50'
                            : item.condition === 'GOOD'
                            ? 'text-teal-400 bg-teal-950/40 border-teal-800/50'
                            : item.condition === 'USED'
                            ? 'text-amber-400 bg-amber-950/40 border-amber-800/50'
                            : 'text-rose-400 bg-rose-950/40 border-rose-800/50'
                        }`}
                      >
                        {item.condition}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            max="500"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value, 10) || 1)}
                            className="w-14 bg-slate-950 border border-teal-400 rounded px-1.5 py-0.5 text-center text-white font-mono text-xs"
                          />
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            className="p-1 text-teal-400 hover:text-teal-300"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono tabular-nums font-semibold text-teal-300 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
                          {item.quantity}x
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        {item.location && (
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{item.location}</span>
                          </span>
                        )}
                        {item.location && item.notes && <span>·</span>}
                        {item.notes && <span className="text-slate-500 italic truncate max-w-[140px]">{item.notes}</span>}
                        {!item.location && !item.notes && <span className="text-slate-600">—</span>}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEdit(item.id, item.quantity)}
                          className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded transition-colors"
                          title="Edit quantity"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, comp?.name || 'Component')}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete from inventory"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No components found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
