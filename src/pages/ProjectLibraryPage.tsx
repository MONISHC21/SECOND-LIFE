import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore.ts';
import { useAuthStore } from '../store/useAuthStore.ts';
import { MatchBadge } from '../components/common/MatchBadge.tsx';
import {
  BookOpen,
  Search,
  Clock,
  Leaf,
  Heart,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';

export const ProjectLibraryPage: React.FC = () => {
  const { projects, categories, fetchProjects, toggleFavorite, isLoading } = useProjectStore();
  const { isAuthenticated } = useAuthStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase()) ||
      project.category.toLowerCase().includes(search.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || project.difficulty === selectedDifficulty;

    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-1">
            Predefined Blueprints
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Reusable Electronics Project Library
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified, open-source maker blueprints designed for component recycling and low e-waste footprints.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name, sensors, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 font-sans"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950/60 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-teal-400 font-sans"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((project) => {
          const matchData = project.matchData;

          return (
            <div
              key={project.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
            >
              {/* Card Header & Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-teal-400 font-medium">{project.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{project.estimatedTimeHours}h</span>
                    </span>
                    {isAuthenticated && (
                      <button
                        onClick={() => toggleFavorite(project.id)}
                        className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                          project.isFavorite ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Favorite"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                  {project.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Match indicator if user logged in */}
                {matchData && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <MatchBadge
                      status={matchData.status}
                      percentage={matchData.compatibilityPercentage}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-950/40 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  <span>{project.estimatedWasteSavedGrams}g saved</span>
                </span>

                <Link
                  to={`/projects/${project.id}`}
                  className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
                >
                  <span>Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
