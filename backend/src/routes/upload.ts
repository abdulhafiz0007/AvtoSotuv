import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// POST /api/upload - upload images
router.post(
    '/',
    authMiddleware,
    upload.array('images', 5),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const files = req.files as Express.Multer.File[];

            if (!files || files.length === 0) {
                res.status(400).json({ error: 'Rasm yuklanmadi' });
                return;
            }

            const urls = files.map((file) => `/uploads/${file.filename}`);

            res.json({ urls });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Rasm yuklashda xatolik' });
        }
    }
);

export default router;
