import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { config } from '../config/env';

export async function antiSpamMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
        res.status(401).json({ error: 'Tizimga kiring' });
        return;
    }

    const userId = req.user.userId;

    // Check if user is blocked
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.isBlocked) {
        res.status(403).json({ error: 'Sizning hisobingiz bloklangan' });
        return;
    }

    // Check active listing count
    const activeCount = await prisma.car.count({
        where: { userId, status: 'active' },
    });
    if (activeCount >= config.maxActiveListings) {
        res.status(429).json({
            error: `Siz maksimal ${config.maxActiveListings} ta aktiv e'lon joylashingiz mumkin`,
        });
        return;
    }

    // Check 24-hour cooldown
    const cooldownDate = new Date(Date.now() - config.postingCooldownHours * 60 * 60 * 1000);
    const recentPost = await prisma.car.findFirst({
        where: {
            userId,
            createdAt: { gte: cooldownDate },
        },
        orderBy: { createdAt: 'desc' },
    });
    if (recentPost) {
        res.status(429).json({
            error: `24 soat ichida faqat 1 ta e'lon joylash mumkin`,
        });
        return;
    }

    // Check duplicate (same title + price)
    if (req.body.title && req.body.price) {
        const duplicate = await prisma.car.findFirst({
            where: {
                userId,
                title: req.body.title,
                price: parseInt(req.body.price, 10),
                status: 'active',
            },
        });
        if (duplicate) {
            res.status(409).json({ error: "Bu e'lon allaqachon mavjud" });
            return;
        }
    }

    next();
}
