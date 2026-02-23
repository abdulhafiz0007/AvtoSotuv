import crypto from 'crypto';
import { config } from '../config/env';

interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

export function verifyTelegramInitData(initData: string): TelegramUser | null {
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        if (!hash) return null;

        urlParams.delete('hash');

        // Sort parameters alphabetically
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // Create HMAC
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(config.botToken)
            .digest();

        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        if (calculatedHash !== hash) {
            console.error('❌ Hash mismatch!');
            console.error('Calculated:', calculatedHash);
            console.error('Received:', hash);
            return null;
        }

        // Check auth_date is not too old (allow 24 hours)
        const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
        const now = Math.floor(Date.now() / 1000);
        if (now - authDate > 86400) return null;

        const userString = urlParams.get('user');
        if (!userString) return null;

        return JSON.parse(userString) as TelegramUser;
    } catch {
        return null;
    }
}
