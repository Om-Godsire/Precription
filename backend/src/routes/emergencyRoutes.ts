import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getEmergencyProfile, generateEmergencyQR, getPrescriptionDetails } from '../controllers/emergencyController';

const router = Router();

// Public emergency profile
router.get('/:token', getEmergencyProfile);

// Patient-only: get QR code
router.get('/qr/generate', authenticate, authorize('patient'), generateEmergencyQR);

export default router;
