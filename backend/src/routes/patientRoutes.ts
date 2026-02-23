import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getProfile, updateProfile, getMedications, getAdherenceScore, getDashboard, regenerateEmergencyToken, getPrescriptions } from '../controllers/patientController';

const router = Router();

router.use(authenticate);
router.use(authorize('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/medications', getMedications);
router.get('/adherence-score', getAdherenceScore);
router.get('/dashboard', getDashboard);
router.get('/prescriptions', getPrescriptions);
router.post('/emergency-token', regenerateEmergencyToken);

export default router;
