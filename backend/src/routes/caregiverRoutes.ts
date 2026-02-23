import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { caregiverLinkSchema } from '../utils/validators';
import { linkPatient, getLinkedPatients, getPatientDashboard, getDashboard } from '../controllers/caregiverController';

const router = Router();

router.use(authenticate);
router.use(authorize('caregiver'));

router.post('/link', validate(caregiverLinkSchema), linkPatient);
router.get('/patients', getLinkedPatients);
router.get('/patients/:patientId', getPatientDashboard);
router.get('/dashboard', getDashboard);

export default router;
