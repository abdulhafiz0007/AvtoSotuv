import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { antiSpamMiddleware } from '../middleware/antiSpam';
import { upload } from '../middleware/upload';

const router = Router();

// GET /api/cars - list cars with filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            brand,
            city,
            yearFrom,
            yearTo,
            priceFrom,
            priceTo,
            search,
            sort = 'newest',
            page = '1',
            limit = '20',
        } = req.query;

        const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
        const take = Math.min(parseInt(limit as string, 10), 50);

        const where: any = { status: 'active' };

        if (brand) where.brand = brand as string;
        if (city) where.city = city as string;
        if (yearFrom || yearTo) {
            where.year = {};
            if (yearFrom) where.year.gte = parseInt(yearFrom as string, 10);
            if (yearTo) where.year.lte = parseInt(yearTo as string, 10);
        }
        if (priceFrom || priceTo) {
            where.price = {};
            if (priceFrom) where.price.gte = parseInt(priceFrom as string, 10);
            if (priceTo) where.price.lte = parseInt(priceTo as string, 10);
        }
        if (search) {
            where.title = { contains: search as string, mode: 'insensitive' };
        }

        let orderBy: any = { createdAt: 'desc' };
        if (sort === 'cheapest') orderBy = { price: 'asc' };
        if (sort === 'expensive') orderBy = { price: 'desc' };

        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where,
                orderBy,
                skip,
                take,
                include: {
                    images: { take: 1 },
                    user: { select: { firstName: true, username: true } },
                },
            }),
            prisma.car.count({ where }),
        ]);

        // Serialize BigInt
        const serializedCars = cars.map((car) => ({
            ...car,
            user: car.user,
            images: car.images,
        }));

        res.json({
            cars: serializedCars,
            total,
            page: parseInt(page as string, 10),
            totalPages: Math.ceil(total / take),
        });
    } catch (error) {
        console.error('List cars error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/cars/my - get user's listings
router.get('/my', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const cars = await prisma.car.findMany({
            where: { userId: req.user!.userId },
            orderBy: { createdAt: 'desc' },
            include: { images: { take: 1 } },
        });

        res.json({ cars });
    } catch (error) {
        console.error('My cars error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// GET /api/cars/:id - car detail
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Noto\'g\'ri ID' });
            return;
        }

        const car = await prisma.car.findUnique({
            where: { id },
            include: {
                images: true,
                user: { select: { firstName: true, username: true, phone: true } },
            },
        });

        if (!car || car.status === 'deleted') {
            res.status(404).json({ error: "E'lon topilmadi" });
            return;
        }

        // Increment views
        await prisma.car.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        res.json({ car: { ...car, views: car.views + 1 } });
    } catch (error) {
        console.error('Car detail error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// POST /api/cars - create listing
router.post(
    '/',
    authMiddleware,
    antiSpamMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, brand, year, price, mileage, city, description, imageUrls } = req.body;

            // Validate required fields
            if (!title || !brand || !year || !price || !mileage || !city || !description) {
                res.status(400).json({ error: "Barcha maydonlarni to'ldiring" });
                return;
            }

            if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
                res.status(400).json({ error: 'Kamida 1 ta rasm yuklang' });
                return;
            }

            const car = await prisma.car.create({
                data: {
                    userId: req.user!.userId,
                    title: title.trim(),
                    brand,
                    year: parseInt(year, 10),
                    price: parseInt(price, 10),
                    mileage: parseInt(mileage, 10),
                    city,
                    description: description.trim(),
                    images: {
                        create: imageUrls.map((url: string) => ({ imageUrl: url })),
                    },
                },
                include: { images: true },
            });

            res.status(201).json({ car });
        } catch (error) {
            console.error('Create car error:', error);
            res.status(500).json({ error: 'Server xatosi' });
        }
    }
);

// DELETE /api/cars/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id as string, 10);

        const car = await prisma.car.findUnique({ where: { id } });
        if (!car) {
            res.status(404).json({ error: "E'lon topilmadi" });
            return;
        }

        if (car.userId !== req.user!.userId && !req.user!.isAdmin) {
            res.status(403).json({ error: "Bu e'lonni o'chirishga ruxsat yo'q" });
            return;
        }

        await prisma.car.update({
            where: { id },
            data: { status: 'deleted' },
        });

        res.json({ message: "E'lon o'chirildi" });
    } catch (error) {
        console.error('Delete car error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
