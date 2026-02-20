import { Router, Request, Response } from 'express';
import prisma from '../config/database';
import { verifyTelegramInitData } from '../utils/telegram';
import { generateToken } from '../utils/jwt';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { initData } = req.body;

        if (!initData) {
            res.status(400).json({ error: 'initData taqdim etilmagan' });
            return;
        }

        // In development, allow mock auth
        let telegramUser;
        if (process.env.NODE_ENV === 'development' && initData === 'dev_mode') {
            telegramUser = {
                id: 123456789,
                first_name: 'Dev',
                username: 'developer',
            };
        } else {
            telegramUser = verifyTelegramInitData(initData);
        }

        if (!telegramUser) {
            res.status(401).json({ error: 'Telegram autentifikatsiya xatosi' });
            return;
        }

        // Find or create user
        let user = await prisma.user.findUnique({
            where: { telegramId: BigInt(telegramUser.id) },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: BigInt(telegramUser.id),
                    firstName: telegramUser.first_name,
                    username: telegramUser.username || null,
                },
            });
        } else {
            // Update user info
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    firstName: telegramUser.first_name,
                    username: telegramUser.username || user.username,
                },
            });
        }

        if (user.isBlocked) {
            res.status(403).json({ error: 'Sizning hisobingiz bloklangan' });
            return;
        }

        const token = generateToken({
            userId: user.id,
            telegramId: telegramUser.id,
            isAdmin: user.isAdmin,
        });

        res.json({
            token,
            user: {
                id: user.id,
                telegramId: user.telegramId.toString(),
                username: user.username,
                firstName: user.firstName,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({ error: 'Server xatosi' });
    }
});

export default router;
