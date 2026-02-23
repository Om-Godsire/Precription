import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { refillSchema } from '../utils/validators';
import { verifyPrescription, logRefill, getRefills, getDashboard } from '../controllers/pharmacyController';

const router = Router();

// Public verification endpoint
router.get('/verify/:code', verifyPrescription);

// Pharmacy-only routes
router.use(authenticate);
router.use(authorize('pharmacy'));

router.post('/refills', validate(refillSchema), logRefill);
router.get('/refills', getRefills);
router.get('/dashboard', getDashboard);

export default router;
