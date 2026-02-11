import { Router } from 'express';
import { verifyRecyclePin } from '../controllers/recycleController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/verify-pin', protect, verifyRecyclePin);

export default router;
