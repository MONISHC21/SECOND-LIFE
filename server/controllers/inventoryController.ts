import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.ts';
import { db } from '../db/store.ts';
import { InventoryItem, ComponentCondition } from '../types/index.ts';

export const getInventory = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { search, category, condition } = req.query;
    let items = db.getInventoryByUserId(req.user.id);

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      items = items.filter((i) => {
        const comp = i.component;
        if (!comp) return false;
        return (
          comp.name.toLowerCase().includes(q) ||
          comp.category.toLowerCase().includes(q) ||
          (i.notes && i.notes.toLowerCase().includes(q)) ||
          (i.location && i.location.toLowerCase().includes(q))
        );
      });
    }

    if (category && typeof category === 'string' && category !== 'All') {
      items = items.filter((i) => i.component && i.component.category.toLowerCase() === category.toLowerCase());
    }

    if (condition && typeof condition === 'string' && condition !== 'All') {
      items = items.filter((i) => i.condition === condition);
    }

    // Summary stats for user's inventory
    const totalItems = items.length;
    const totalPhysicalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalWeightGrams = items.reduce(
      (sum, i) => sum + (i.component ? i.component.estimatedWeightGrams * i.quantity : 0),
      0
    );
    const totalCO2AvoidedGrams = items.reduce(
      (sum, i) => sum + (i.component ? i.component.estimatedCO2Grams * i.quantity : 0),
      0
    );

    res.json({
      success: true,
      data: {
        inventory: items,
        stats: {
          totalItemTypes: totalItems,
          totalPhysicalQuantity,
          totalWeightGrams: Math.round(totalWeightGrams),
          totalCO2AvoidedGrams: Math.round(totalCO2AvoidedGrams),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addInventoryItem = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { componentId, quantity = 1, condition = 'GOOD', location, notes } = req.body;

    if (!componentId) {
      res.status(400).json({ success: false, message: 'componentId is required' });
      return;
    }

    const numQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    const component = db.getComponentById(componentId);

    if (!component) {
      res.status(404).json({ success: false, message: 'Component does not exist in master catalog' });
      return;
    }

    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user.id,
      componentId,
      quantity: numQuantity,
      condition: (condition as ComponentCondition) || 'GOOD',
      location: location ? location.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = db.addInventoryItem(newItem);

    res.status(201).json({
      success: true,
      message: `Added ${component.name} (${numQuantity}x) to your inventory`,
      data: { item: saved },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateInventoryItem = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const existing = db.getInventoryItem(id);

    if (!existing || existing.userId !== req.user.id) {
      res.status(404).json({ success: false, message: 'Inventory item not found or unauthorized' });
      return;
    }

    const { quantity, condition, location, notes } = req.body;

    const updates: Partial<InventoryItem> = {};
    if (quantity !== undefined) {
      const q = parseInt(quantity, 10);
      if (q <= 0) {
        db.deleteInventoryItem(id);
        res.json({ success: true, message: 'Item quantity reached 0 and was removed from inventory' });
        return;
      }
      updates.quantity = q;
    }
    if (condition) updates.condition = condition;
    if (location !== undefined) updates.location = location ? location.trim() : undefined;
    if (notes !== undefined) updates.notes = notes ? notes.trim() : undefined;

    const updated = db.updateInventoryItem(id, updates);

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: { item: updated },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteInventoryItem = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const existing = db.getInventoryItem(id);

    if (!existing || existing.userId !== req.user.id) {
      res.status(404).json({ success: false, message: 'Inventory item not found or unauthorized' });
      return;
    }

    db.deleteInventoryItem(id);
    res.json({ success: true, message: 'Component removed from your inventory' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetDemoInventory = (req: AuthenticatedRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    // Clear existing for this user
    const userItems = db.getInventoryByUserId(req.user.id);
    for (const item of userItems) {
      db.deleteInventoryItem(item.id);
    }

    // Benchmark set: ESP32 x1, HC-SR04 x1, DC Motor x2, 18650 Battery x1, Servo x1, DHT11 x1
    const benchmarkItems = [
      { componentId: 'comp_esp32', quantity: 1, notes: 'ESP32 dual-core Wi-Fi & BLE module' },
      { componentId: 'comp_hcsr04', quantity: 1, notes: 'HC-SR04 ultrasonic distance sensor' },
      { componentId: 'comp_dc_motor', quantity: 2, notes: 'Dual TT gear motors' },
      { componentId: 'comp_battery_18650', quantity: 1, notes: '18650 rechargeable Li-ion cell' },
      { componentId: 'comp_servo_sg90', quantity: 1, notes: 'SG90 9g micro servo motor' },
      { componentId: 'comp_dht11', quantity: 1, notes: 'DHT11 temperature & humidity module' },
    ];

    for (const b of benchmarkItems) {
      db.addInventoryItem({
        id: `inv_bench_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: req.user.id,
        componentId: b.componentId,
        quantity: b.quantity,
        condition: 'GOOD',
        location: 'Demo Benchmark Bin',
        notes: b.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const reloaded = db.getInventoryByUserId(req.user.id);

    res.json({
      success: true,
      message: 'Demo inventory reset to benchmark scenario: ESP32 x1, HC-SR04 x1, DC Motor x2, Battery x1, Servo x1, DHT11 x1',
      data: { inventory: reloaded },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
