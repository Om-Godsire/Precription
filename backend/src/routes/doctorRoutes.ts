import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { prescriptionSchema } from '../utils/validators';
import {
    getProfile, updateProfile, createPrescription,
    getPrescriptions, getPatientHistory, searchPatients, getDashboard, addPatient
} from '../controllers/doctorController';

const router = Router();

router.use(authenticate);
router.use(authorize('doctor'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/prescriptions', validate(prescriptionSchema), createPrescription);
router.get('/prescriptions', getPrescriptions);
router.get('/patients/search', searchPatients);
router.post('/patients', addPatient);
router.get('/patients/:patientId/history', getPatientHistory);
router.get('/dashboard', getDashboard);

export default router;
