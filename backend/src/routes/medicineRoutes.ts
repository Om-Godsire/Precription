import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { medicineSchema } from '../utils/validators';
import { searchMedicines, getMedicine, createMedicine } from '../controllers/medicineController';

const router = Router();

router.get('/', searchMedicines); // Public - search medicines
router.get('/:id', getMedicine); // Public - get medicine details
router.post('/', authenticate, validate(medicineSchema), createMedicine); // Auth required

export default router;
