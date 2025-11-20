import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createRequestSchema = z.object({
  gadgetId: z.string().uuid(),
  reason: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
});

/**
 * GET /api/requests
 * Get all requests (Admin sees all, users see only their own)
 */
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const isAdmin = req.user?.role === 'ADMIN';

    const requests = await prisma.request.findMany({
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

    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

/**
 * POST /api/requests
 * Create a new gadget request (authenticated users)
 */
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = createRequestSchema.parse(req.body);

    // Check if gadget exists
    const gadget = await prisma.gadget.findUnique({
      where: { id: data.gadgetId },
    });

    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    // Create request
    const request = await prisma.request.create({
      data: {
        userId: req.user!.id,
        gadgetId: data.gadgetId,
        reason: data.reason,
        quantity: data.quantity || 1,
        status: 'PENDING',
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

    res.status(201).json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create request error:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

/**
 * PUT /api/requests/:id/approve
 * Approve a request and create assignment (Admin only)
 */
router.put('/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const requestId = req.params.id;

    // Get the request
    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { gadget: true },
    });

    if (!existingRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (existingRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    // Check gadget availability
    if (existingRequest.gadget.quantity < existingRequest.quantity) {
      return res.status(400).json({ error: 'Insufficient gadget quantity' });
    }

    // Approve request and create assignment
    const result = await prisma.$transaction(async (tx) => {
      // Update request status
      const updatedRequest = await tx.request.update({
        where: { id: requestId },
        data: { status: 'APPROVED' },
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

      // Create assignment
      const assignment = await tx.assignment.create({
        data: {
          userId: existingRequest.userId,
          gadgetId: existingRequest.gadgetId,
          notes: `Auto-assigned from request: ${existingRequest.reason || 'No reason provided'}`,
        },
      });

      // Update gadget quantity
      await tx.gadget.update({
        where: { id: existingRequest.gadgetId },
        data: {
          quantity: { decrement: existingRequest.quantity },
          status: 'IN_USE',
        },
      });

      return { request: updatedRequest, assignment };
    });

    res.json(result);
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

/**
 * PUT /api/requests/:id/reject
 * Reject a request (Admin only)
 */
router.put('/:id/reject', authenticate, requireAdmin, async (req, res) => {
  try {
    const requestId = req.params.id;

    const existingRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!existingRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (existingRequest.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request already processed' });
    }

    const request = await prisma.request.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
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

    res.json(request);
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

/**
 * DELETE /api/requests/:id
 * Delete a request (Users can delete their own pending requests, admins can delete any)
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = request.userId === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: 'Not authorized to delete this request' });
    }

    // Only pending requests can be deleted by regular users
    if (!isAdmin && request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only pending requests can be deleted' });
    }

    await prisma.request.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ error: 'Failed to delete request' });
  }
});

export default router;
