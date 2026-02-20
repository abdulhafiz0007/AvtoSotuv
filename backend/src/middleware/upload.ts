import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { config } from '../config/env';

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, config.uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (config.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Faqat JPG, PNG va WebP formatdagi rasmlar ruxsat etiladi'));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: config.maxFileSize,
        files: config.maxImages,
    },
});
