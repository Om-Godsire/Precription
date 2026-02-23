import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { adherenceSchema, sideEffectSchema } from '../utils/validators';
import { logAdherence, getLogs, logSideEffect, getSideEffects } from '../controllers/adherenceController';

const router = Router();

router.use(authenticate);
router.use(authorize('patient'));

router.post('/log', validate(adherenceSchema), logAdherence);
router.get('/logs', getLogs);
router.post('/side-effects', validate(sideEffectSchema), logSideEffect);
router.get('/side-effects', getSideEffects);

export default router;
