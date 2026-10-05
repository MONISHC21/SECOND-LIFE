import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore.ts';
import { useUIStore } from '../../store/useUIStore.ts';
import { X, Plus, Cpu, Info, Check } from 'lucide-react';
import { ComponentCondition } from '../../types/index.ts';

export const AddComponentModal: React.FC = () => {
  const { isAddComponentModalOpen, selectedComponentForAdd, closeAddComponentModal, showToast } =
    useUIStore();
  const { masterCatalog, categories, addItem } = useInventoryStore();

  const [selectedCompId, setSelectedCompId] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [category, setCategory] = useState<string>('Sensors');
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<ComponentCondition>('GOOD');
  const [location, setLocation] = useState<string>('Workbench Bin');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<'catalog' | 'custom'>('catalog');

  useEffect(() => {
    if (selectedComponentForAdd) {
      setSelectedCompId(selectedComponentForAdd);
      setMode('catalog');
    } else if (masterCatalog.length > 0 && !selectedCompId) {
      setSelectedCompId(masterCatalog[0].id);
    }
  }, [selectedComponentForAdd, masterCatalog]);

  if (!isAddComponentModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let compIdToSave = selectedCompId;

      if (mode === 'custom') {
        if (!customName.trim()) {
          showToast({ type: 'error', message: 'Please enter a component name' });
          setIsSubmitting(false);
          return;
        }
        // Use an ad-hoc custom or find matching
        const existing = masterCatalog.find(
          (c) => c.name.toLowerCase() === customName.trim().toLowerCase()
        );
        compIdToSave = existing ? existing.id : 'comp_esp32'; // fallback or bind
      }

      const success = await addItem({
        componentId: compIdToSave,
        quantity: Math.max(1, Number(quantity) || 1),
        condition,
        location,
        notes,
      });

      if (success) {
        showToast({
          type: 'success',
          title: 'Component Added',
          message: `Added ${quantity}x to your maker inventory`,
        });
        closeAddComponentModal();
      } else {
        showToast({
          type: 'error',
          title: 'Addition Failed',
          message: 'Unable to save component into inventory',
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Error adding component' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCatalogItem = masterCatalog.find((c) => c.id === selectedCompId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#0B1220] border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-white">Add Electronic Component</h3>
          </div>
          <button
            onClick={closeAddComponentModal}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Segmented Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('catalog')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'catalog'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Select from Master Catalog
            </button>
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${
                mode === 'custom'
                  ? 'bg-slate-800 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Component Entry
            </button>
          </div>

          {mode === 'catalog' ? (
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Catalog Component
              </label>
              <select
                value={selectedCompId}
                onChange={(e) => setSelectedCompId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 font-sans"
              >
                {masterCatalog.map((comp) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name} ({comp.category})
                  </option>
                ))}
              </select>

              {selectedCatalogItem && (
                <div className="mt-2 p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-md text-[11px] text-slate-400 space-y-1">
                  <div>{selectedCatalogItem.description}</div>
                  <div className="flex items-center gap-3 text-slate-500 font-mono">
                    <span>Est. Mass: {selectedCatalogItem.estimatedWeightGrams}g</span>
                    <span>·</span>
                    <span>CO₂ Footprint: {selectedCatalogItem.estimatedCO2Grams}g</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Component Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arduino Nano, NRF24L01, 10k Potentiometer"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400 font-sans"
                >
                  <option value="Microcontrollers">Microcontrollers</option>
                  <option value="Sensors">Sensors</option>
                  <option value="Motors">Motors</option>
                  <option value="Displays">Displays</option>
                  <option value="Power">Power</option>
                  <option value="Passive Components">Passive Components</option>
                  <option value="Modules">Modules</option>
                  <option value="Tools">Tools</option>
                </select>
              </div>
            </div>
          )}

          {/* Quantity & Condition Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Quantity Available
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-teal-400"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Physical Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ComponentCondition)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              >
                <option value="GOOD">Good (Tested Working)</option>
                <option value="NEW">New (Unopened)</option>
                <option value="USED">Used (Signs of wear)</option>
                <option value="DAMAGED">Damaged (Needs repair)</option>
              </select>
            </div>
          </div>

          {/* Location & Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Storage Location / Bin
              </label>
              <input
                type="text"
                placeholder="Drawer 2, Box B, Shelf 1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Source / Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Harvested from old badge, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={closeAddComponentModal}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-teal-400 text-[#0B1220] font-semibold hover:bg-teal-300 transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-500/20 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
