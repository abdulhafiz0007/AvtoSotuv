import { Router, Request, Response } from 'express';
import prisma from '../config/database';

const router = Router();

// GET /api/services - list auto services
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, city, search } = req.query;

        const where: any = {};

        if (type) where.type = type as string;
        if (city) where.city = city as string;
        if (search) {
            where.title = { contains: search as string, mode: 'insensitive' };
        }

        const services = await prisma.service.findMany({
            where,
            orderBy: { rating: 'desc' },
        });

        res.json({ services });
    } catch (error) {
        console.error('List services error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/services/:id - service detail
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Noto\'g\'ri ID' });
            return;
        }

        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            res.status(404).json({ error: 'Xizmat topilmadi' });
            return;
        }

        res.json({ service });
    } catch (error) {
        console.error('Service detail error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
