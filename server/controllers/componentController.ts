import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../db/store.ts';
import { Component, ComponentCondition } from '../types/index.ts';

export const getComponents = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { search, category, condition, page = '1', limit = '50' } = req.query;

    let components = db.getComponents();

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      components = components.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          (c.manufacturer && c.manufacturer.toLowerCase().includes(q))
      );
    }

    if (category && typeof category === 'string' && category !== 'All') {
      components = components.filter((c) => c.category.toLowerCase() === category.toLowerCase());
    }

    if (condition && typeof condition === 'string' && condition !== 'All') {
      components = components.filter((c) => c.condition === condition);
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 50));
    const total = components.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = components.slice(startIndex, startIndex + limitNum);

    // Categories list for filters
    const allCategories = Array.from(new Set(db.getComponents().map((c) => c.category))).sort();

    res.json({
      success: true,
      data: {
        components: paginated,
        categories: allCategories,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComponentById = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const component = db.getComponentById(id);

    if (!component) {
      res.status(404).json({ success: false, message: 'Component not found' });
      return;
    }

    res.json({ success: true, data: { component } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createComponent = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      name,
      category,
      manufacturer,
      description,
      defaultUnit = 'pcs',
      condition = 'GOOD',
      estimatedWeightGrams = 20,
      estimatedCO2Grams = 150,
      datasheetUrl,
      imageUrl,
    } = req.body;

    if (!name || !category || !description) {
      res.status(400).json({
        success: false,
        message: 'Name, category, and description are required',
      });
      return;
    }

    const newComponent: Component = {
      id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category: category.trim(),
      manufacturer: manufacturer ? manufacturer.trim() : undefined,
      description: description.trim(),
      defaultUnit,
      condition: condition as ComponentCondition,
      estimatedWeightGrams: Math.max(0.1, Number(estimatedWeightGrams) || 20),
      estimatedCO2Grams: Math.max(1, Number(estimatedCO2Grams) || 150),
      datasheetUrl: datasheetUrl ? datasheetUrl.trim() : undefined,
      imageUrl: imageUrl ? imageUrl.trim() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.createComponent(newComponent);
    res.status(201).json({
      success: true,
      message: 'Component created in catalog',
      data: { component: saved },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComponent = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updated = db.updateComponent(id, req.body);

    if (!updated) {
      res.status(404).json({ success: false, message: 'Component not found' });
      return;
    }

    res.json({
      success: true,
      message: 'Component updated',
      data: { component: updated },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComponent = (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = db.deleteComponent(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Component not found' });
      return;
    }

    res.json({ success: true, message: 'Component removed from catalog' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
