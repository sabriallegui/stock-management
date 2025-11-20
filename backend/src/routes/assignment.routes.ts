import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Validation schema
const createAssignmentSchema = z.object({
  userId: z.string().uuid(),
  gadgetId: z.string().uuid(),
  notes: z.string().optional(),
});

/**
 * GET /api/assignments
 * Get all assignments (Admin sees all, users see only their own)
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';
    
    const assignments = await prisma.assignment.findMany({
      where: isAdmin ? {} : { userId: req.user?.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        gadget: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

/**
 * POST /api/assignments
 * Create a new assignment (Admin only - assign gadget to user)
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = createAssignmentSchema.parse(req.body);

    // Check if gadget exists and is available
    const gadget = await prisma.gadget.findUnique({
      where: { id: data.gadgetId },
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    if (gadget.quantity < 1) {
      return res.status(400).json({ error: 'Gadget is out of stock' });
    }

    // Create assignment and update gadget quantity
    const assignment = await prisma.$transaction(async (tx) => {
      // Create assignment
      const newAssignment = await tx.assignment.create({
        data: {
          userId: data.userId,
          gadgetId: data.gadgetId,
          notes: data.notes,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          gadget: true,
        },
      });

      // Update gadget quantity
      await tx.gadget.update({
        where: { id: data.gadgetId },
        data: {
          quantity: { decrement: 1 },
          status: 'IN_USE',
        },
      });

      return newAssignment;
    });

    res.status(201).json(assignment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create assignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

/**
 * PUT /api/assignments/:id/return
 * Mark an assignment as returned
 */
router.put('/:id/return', authenticate, async (req: AuthRequest, res) => {
  try {
    const assignmentId = req.params.id;

    // Get the assignment
    const existingAssignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: { gadget: true },
    });

    if (!existingAssignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if user has permission (admin or assignment owner)
    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = existingAssignment.userId === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Not authorized to return this assignment' });
    }

    if (existingAssignment.returned) {
      return res.status(400).json({ error: 'Assignment already returned' });
    }

    // Mark as returned and update gadget quantity
    const assignment = await prisma.$transaction(async (tx) => {
      // Update assignment
      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          returned: true,
          returnedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          gadget: true,
        },
      });

      // Increment gadget quantity back
      await tx.gadget.update({
        where: { id: existingAssignment.gadgetId },
        data: {
          quantity: { increment: 1 },
        },
      });

      return updatedAssignment;
    });

    res.json(assignment);
  } catch (error) {
    console.error('Return assignment error:', error);
    res.status(500).json({ error: 'Failed to return assignment' });
  }
});

/**
 * DELETE /api/assignments/:id
 * Delete an assignment (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.id },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // If not returned, increment gadget quantity back
    if (!assignment.returned) {
      await prisma.$transaction(async (tx) => {
        await tx.assignment.delete({
          where: { id: req.params.id },
        });

        await tx.gadget.update({
          where: { id: assignment.gadgetId },
          data: {
            quantity: { increment: 1 },
          },
        });
      });
    } else {
      await prisma.assignment.delete({
        where: { id: req.params.id },
      });
    }

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;
