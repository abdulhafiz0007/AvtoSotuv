import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config/env';

// Routes
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';
import uploadRoutes from './routes/upload';
import adminRoutes from './routes/admin';
import constantsRoutes from './routes/constants';
import serviceRoutes from './routes/services';

const app = express();

// BigInt serialization fix
(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', config.uploadDir);
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Security
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { error: "So'rovlar limiti oshib ketdi. Iltimos, keyinroq urinib ko'ring." },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (uploaded images)
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/constants', constantsRoutes);
app.use('/api/services', serviceRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);

    if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ error: 'Fayl hajmi juda katta (max 5MB)' });
        return;
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
        res.status(400).json({ error: 'Juda ko\'p fayl (max 5 ta)' });
        return;
    }

    res.status(500).json({ error: 'Server xatosi' });
});

// Start server
app.listen(config.port, () => {
    console.log(`🚗 AvtoSotuv API running on http://localhost:${config.port}`);
    console.log(`📦 Environment: ${config.nodeEnv}`);
});

export default app;
