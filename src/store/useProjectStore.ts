import { create } from 'zustand';
import { api } from '../services/api.ts';
import { Project, ProjectMatchResult } from '../types/index.ts';

interface RecommendationSummary {
  totalMatchedProjects: number;
  readyToBuildCount: number;
  nearMatchCount: number;
  partialMatchCount: number;
}

interface ProjectState {
  projects: Project[];
  recommendations: ProjectMatchResult[];
  recommendationSummary: RecommendationSummary;
  selectedProject: Project | null;
  selectedProjectMatch: ProjectMatchResult | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;

  fetchProjects: (params?: { category?: string; difficulty?: string; search?: string }) => Promise<void>;
  fetchProjectById: (id: string) => Promise<void>;
  fetchRecommendations: (params?: { status?: string; category?: string; sort?: string }) => Promise<void>;
  toggleFavorite: (projectId: string) => Promise<boolean>;
  markCompleted: (projectId: string, notes?: string, rating?: number) => Promise<boolean>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  recommendations: [],
  recommendationSummary: {
    totalMatchedProjects: 0,
    readyToBuildCount: 0,
    nearMatchCount: 0,
    partialMatchCount: 0,
  },
  selectedProject: null,
  selectedProjectMatch: null,
  categories: [],
  isLoading: false,
  error: null,

  fetchProjects: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getProjects(params);
      if (res.success && res.data) {
        set({
          projects: res.data.projects || [],
          categories: res.data.categories || [],
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch projects', isLoading: false });
    }
  },

  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getProjectById(id);
      if (res.success && res.data) {
        set({
          selectedProject: res.data.project,
          selectedProjectMatch: res.data.matchData,
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch project details', isLoading: false });
    }
  },

  fetchRecommendations: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.getRecommendations(params);
      if (res.success && res.data) {
        set({
          recommendations: res.data.recommendations || [],
          recommendationSummary: res.data.summary || {
            totalMatchedProjects: 0,
            readyToBuildCount: 0,
            nearMatchCount: 0,
            partialMatchCount: 0,
          },
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to run matching engine', isLoading: false });
    }
  },

  toggleFavorite: async (projectId) => {
    try {
      const res = await api.toggleFavorite(projectId);
      if (res.success) {
        // Optimistically update
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, isFavorite: res.data.isFavorite } : p
          ),
          selectedProject:
            state.selectedProject?.id === projectId
              ? { ...state.selectedProject, isFavorite: res.data.isFavorite }
              : state.selectedProject,
        }));
        return true;
      }
      return false;
    } catch (err: any) {
      return false;
    }
  },

  markCompleted: async (projectId, notes, rating) => {
    try {
      const res = await api.markCompleted(projectId, { notes, rating });
      return res.success;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },
}));
