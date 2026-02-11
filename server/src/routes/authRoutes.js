import { Router } from 'express';
import { login, me, register, setRecyclePin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema } from '../utils/validators.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, me);
router.patch('/recycle-pin', protect, setRecyclePin);

export default router;
