import { create } from 'zustand';
import { api } from '../services/api.ts';
import { InventoryItem, Component } from '../types/index.ts';

interface InventoryStats {
  totalItemTypes: number;
  totalPhysicalQuantity: number;
  totalWeightGrams: number;
  totalCO2AvoidedGrams: number;
}

interface InventoryState {
  items: InventoryItem[];
  masterCatalog: Component[];
  categories: string[];
  stats: InventoryStats;
  isLoading: boolean;
  error: string | null;

  fetchInventory: (params?: { search?: string; category?: string }) => Promise<void>;
  fetchMasterCatalog: () => Promise<void>;
  addItem: (data: { componentId: string; quantity: number; condition?: string; location?: string; notes?: string }) => Promise<boolean>;
  updateItem: (id: string, data: { quantity?: number; condition?: string; location?: string; notes?: string }) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  resetDemoInventory: () => Promise<boolean>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  masterCatalog: [],
  categories: [],
  stats: {
    totalItemTypes: 0,
    totalPhysicalQuantity: 0,
    totalWeightGrams: 0,
    totalCO2AvoidedGrams: 0,
  },
  isLoading: false,
  error: null,

  fetchInventory: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getInventory(params);
      if (res.success && res.data) {
        set({
          items: res.data.inventory || [],
          stats: res.data.stats || {
            totalItemTypes: 0,
            totalPhysicalQuantity: 0,
            totalWeightGrams: 0,
            totalCO2AvoidedGrams: 0,
          },
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to load inventory', isLoading: false });
    }
  },

  fetchMasterCatalog: async () => {
    try {
      const res = await api.getComponents({ limit: 100 });
      if (res.success && res.data) {
        set({
          masterCatalog: res.data.components || [],
          categories: res.data.categories || [],
        });
      }
    } catch (e) {
      // Non-blocking
    }
  },

  addItem: async (data) => {
    try {
      const res = await api.addInventoryItem(data);
      if (res.success) {
        await get().fetchInventory();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  updateItem: async (id, data) => {
    try {
      const res = await api.updateInventoryItem(id, data);
      if (res.success) {
        await get().fetchInventory();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  deleteItem: async (id) => {
    try {
      const res = await api.deleteInventoryItem(id);
      if (res.success) {
        await get().fetchInventory();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  resetDemoInventory: async () => {
    set({ isLoading: true });
    try {
      const res = await api.resetDemoInventory();
      if (res.success) {
        await get().fetchInventory();
        return true;
      }
      return false;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
