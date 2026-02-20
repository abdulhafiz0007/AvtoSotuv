import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                telegramId: number;
                isAdmin: boolean;
            };
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Token taqdim etilmagan' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
        res.status(401).json({ error: 'Noto\'g\'ri token' });
        return;
    }

    req.user = payload;
    next();
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.user?.isAdmin) {
        res.status(403).json({ error: 'Admin huquqi talab etiladi' });
        return;
    }
    next();
}
