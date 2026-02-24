import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

// All admin routes require auth + admin
router.use(authMiddleware, adminMiddleware);

// GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalUsers, totalListings, activeListings, todayListings] = await Promise.all([
            prisma.user.count(),
            prisma.car.count({ where: { status: { not: 'deleted' } } }),
            prisma.car.count({ where: { status: 'active' } }),
            prisma.car.count({ where: { createdAt: { gte: today } } }),
        ]);

        // Sum views for today's listings is approximation
        const totalViews = await prisma.car.aggregate({
            _sum: { views: true },
        });

        res.json({
            totalUsers,
            totalListings,
            activeListings,
            todayListings,
            totalViews: totalViews._sum.views || 0,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/admin/cars
router.get('/cars', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string || '1', 10);
        const limit = 20;
        const skip = (page - 1) * limit;

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where: { status: { not: 'deleted' } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    images: { take: 1 },
                    user: { select: { firstName: true, username: true, telegramId: true } },
                },
            }),
            prisma.car.count({ where: { status: { not: 'deleted' } } }),
        ]);

        const serializedCars = cars.map((car) => ({
            ...car,
            user: {
                ...car.user,
                telegramId: car.user.telegramId.toString(),
            },
        }));

        res.json({
            cars: serializedCars,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Admin cars error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// DELETE /api/admin/cars/:id
router.delete('/cars/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        await prisma.car.update({
            where: { id },
            data: { status: 'deleted' },
        });
        res.json({ message: "E'lon o'chirildi" });
    } catch (error) {
        console.error('Admin delete car error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/admin/users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string || '1', 10);
        const limit = 20;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    _count: { select: { cars: true } },
                },
            }),
            prisma.user.count(),
        ]);

        const serializedUsers = users.map((user) => ({
            ...user,
            telegramId: user.telegramId.toString(),
        }));

        res.json({
            users: serializedUsers,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// PUT /api/admin/users/:id/block
router.put('/users/:id/block', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
            return;
        }

        const updated = await prisma.user.update({
            where: { id },
            data: { isBlocked: !user.isBlocked },
        });

        res.json({
            user: { ...updated, telegramId: updated.telegramId.toString() },
            message: updated.isBlocked ? 'Foydalanuvchi bloklandi' : 'Blokdan chiqarildi',
        });
    } catch (error) {
        console.error('Admin block user error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
