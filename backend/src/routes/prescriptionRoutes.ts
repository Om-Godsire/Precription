import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getPrescriptionDetails } from '../controllers/emergencyController';

const router = Router();

router.get('/:id', authenticate, getPrescriptionDetails);

export default router;
