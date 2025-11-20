import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createGadgetSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  quantity: z.number().int().min(0),
  status: z.enum(['AVAILABLE', 'IN_USE', 'BROKEN', 'MAINTENANCE']).optional(),
  category: z.string().optional(),
});

const updateGadgetSchema = createGadgetSchema.partial();

/**
 * GET /api/gadgets
 * Get all gadgets (accessible by all authenticated users)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const gadgets = await prisma.gadget.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            assignments: true,
            requests: true,
          },
        },
      },
    });

    res.json(gadgets);
  } catch (error) {
    console.error('Get gadgets error:', error);
    res.status(500).json({ error: 'Failed to fetch gadgets' });
  }
});

/**
 * GET /api/gadgets/:id
 * Get a specific gadget with its history
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const gadget = await prisma.gadget.findUnique({
      where: { id: req.params.id },
      include: {
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        requests: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    res.json(gadget);
  } catch (error) {
    console.error('Get gadget error:', error);
    res.status(500).json({ error: 'Failed to fetch gadget' });
  }
});

/**
 * POST /api/gadgets
 * Create a new gadget (Admin only)
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = createGadgetSchema.parse(req.body);

    const gadget = await prisma.gadget.create({
      data: {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        status: data.status || 'AVAILABLE',
        category: data.category,
      },
    });

    res.status(201).json(gadget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create gadget error:', error);
    res.status(500).json({ error: 'Failed to create gadget' });
  }
});

/**
 * PUT /api/gadgets/:id
 * Update a gadget (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = updateGadgetSchema.parse(req.body);

    const gadget = await prisma.gadget.update({
      where: { id: req.params.id },
      data,
    });

    res.json(gadget);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update gadget error:', error);
    res.status(500).json({ error: 'Failed to update gadget' });
  }
});

/**
 * DELETE /api/gadgets/:id
 * Delete a gadget (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await prisma.gadget.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Gadget deleted successfully' });
  } catch (error) {
    console.error('Delete gadget error:', error);
    res.status(500).json({ error: 'Failed to delete gadget' });
  }
});

export default router;
