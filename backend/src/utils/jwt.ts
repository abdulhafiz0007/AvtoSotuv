import jwt from 'jsonwebtoken';
import { config } from '../config/env';

interface JwtPayload {
    userId: number;
    telegramId: number;
    isAdmin: boolean;
}

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch {
        return null;
    }
}
