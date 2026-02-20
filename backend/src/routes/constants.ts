import { Router, Request, Response } from 'express';
import { CAR_BRANDS, CITIES, YEARS, i18n } from '../config/constants';

const router = Router();

// GET /api/constants - get app constants for frontend
router.get('/', (_req: Request, res: Response): void => {
    res.json({
        brands: CAR_BRANDS,
        cities: CITIES,
        years: YEARS,
        i18n,
    });
});

export default router;
