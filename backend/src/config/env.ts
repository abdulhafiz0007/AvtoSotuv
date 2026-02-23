import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL!,
    botToken: process.env.BOT_TOKEN!,
    jwtSecret: process.env.JWT_SECRET!,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',

    // Anti-spam
    maxActiveListings: 3,
    postingCooldownHours: 24,

    // Upload
    maxImages: 5,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    uploadDir: 'uploads',
};
