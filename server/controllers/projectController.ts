import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../db/store.ts';
import { matchingService } from '../services/matchingService.ts';
import { Project, ProjectDifficulty, ProjectRequirement } from '../types/index.ts';

export const getProjects = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { category, difficulty, search, featured } = req.query;

    let projects = db.getProjects();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      projects = projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== 'All') {
      projects = projects.filter((p) => p.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (featured === 'true') {
      projects = projects.filter((p) => p.featured);
    }

    // If user is authenticated, compute feasibility for each project in this list
    let projectsWithMatch: any[] = projects;
    let favoriteIds: string[] = [];

    if (req.user) {
      favoriteIds = db.getFavoriteProjects(req.user.id);
      projectsWithMatch = projects.map((proj) => {
        const match = matchingService.getProjectMatchForUser(req.user!.id, proj.id);
        return {
          ...proj,
          isFavorite: favoriteIds.includes(proj.id),
          matchData: match
            ? {
                compatibilityPercentage: match.compatibilityPercentage,
                status: match.status,
                missingCount: match.missingComponents.length,
                isReadyToBuild: match.isReadyToBuild,
              }
            : null,
        };
      });
    }

    const categories = Array.from(new Set(db.getProjects().map((p) => p.category))).sort();

    res.json({
      success: true,
      data: {
        projects: projectsWithMatch,
        categories,
        total: projects.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProjectById = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const project = db.getProjectById(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    // If user logged in, include personalized feasibility match details
    let matchData = null;
    let isFavorite = false;
    let isCompleted = false;

    if (req.user) {
      matchData = matchingService.getProjectMatchForUser(req.user.id, project.id);
      isFavorite = db.getFavoriteProjects(req.user.id).includes(project.id);
      const completed = db.getCompletedProjects(req.user.id);
      isCompleted = completed.some((c) => c.projectId === project.id);
    }

    res.json({
      success: true,
      data: {
        project,
        matchData,
        isFavorite,
        isCompleted,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleFavorite = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const isFav = db.toggleFavoriteProject(req.user.id, id);

    res.json({
      success: true,
      data: { isFavorite: isFav },
      message: isFav ? 'Added to favorites' : 'Removed from favorites',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFavorites = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const favIds = db.getFavoriteProjects(req.user.id);
    const favProjects = favIds
      .map((id) => db.getProjectById(id))
      .filter(Boolean) as Project[];

    res.json({
      success: true,
      data: {
        favoriteProjects: favProjects,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markCompleted = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const { rating, notes } = req.body;

    const project = db.getProjectById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const record = db.markProjectCompleted(req.user.id, id, notes, rating);

    res.json({
      success: true,
      message: `Congratulations! "${project.name}" marked as built & reused!`,
      data: { completedProject: record },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      name,
      description,
      longDescription,
      difficulty = 'Beginner',
      estimatedTimeHours = 2.5,
      category,
      circuitDiagram,
      imageUrl,
      estimatedWasteSavedGrams = 100,
      estimatedCO2ReductionGrams = 800,
      tags = [],
      instructions = [],
      requirements = [],
      featured = false,
    } = req.body;

    if (!name || !description || !category) {
      res.status(400).json({ success: false, message: 'Name, description, and category are required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newProject: Project = {
      id: projectId,
      name: name.trim(),
      slug,
      description: description.trim(),
      longDescription: longDescription ? longDescription.trim() : undefined,
      difficulty: difficulty as ProjectDifficulty,
      estimatedTimeHours: Number(estimatedTimeHours) || 2.5,
      category: category.trim(),
      circuitDiagram: circuitDiagram ? circuitDiagram.trim() : undefined,
      imageUrl: imageUrl ? imageUrl.trim() : undefined,
      estimatedWasteSavedGrams: Number(estimatedWasteSavedGrams) || 100,
      estimatedCO2ReductionGrams: Number(estimatedCO2ReductionGrams) || 800,
      tags: Array.isArray(tags) ? tags : [tags],
      instructions: Array.isArray(instructions) ? instructions : undefined,
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const projectRequirements: ProjectRequirement[] = requirements.map((r: any, idx: number) => ({
      id: `req_${projectId}_${idx}`,
      projectId,
      componentId: r.componentId,
      requiredQuantity: Math.max(1, parseInt(r.requiredQuantity, 10) || 1),
      isOptional: Boolean(r.isOptional),
      notes: r.notes,
    }));

    const saved = db.createProject(newProject, projectRequirements);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project: saved },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { requirements, ...rest } = req.body;

    const updated = db.updateProject(id, rest);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    if (requirements && Array.isArray(requirements)) {
      const projectReqs: ProjectRequirement[] = requirements.map((r: any, idx: number) => ({
        id: r.id || `req_${id}_${idx}_${Date.now()}`,
        projectId: id,
        componentId: r.componentId,
        requiredQuantity: Math.max(1, parseInt(r.requiredQuantity, 10) || 1),
        isOptional: Boolean(r.isOptional),
        notes: r.notes,
      }));
      db.updateProjectRequirements(id, projectReqs);
    }

    const reloaded = db.getProjectById(id);

    res.json({
      success: true,
      message: 'Project updated',
      data: { project: reloaded },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProject(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
