import { Router } from 'express';
import {
  createReminder,
  deleteReminder,
  dueReminders,
  listReminders,
  updateReminder,
} from '../controllers/reminderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { reminderSchema } from '../utils/validators.js';

const router = Router();

router.use(protect);
router.get('/', listReminders);
router.get('/due', dueReminders);
router.post('/note/:noteId', validate(reminderSchema), createReminder);
router.patch('/:id', validate(reminderSchema.fork(['remindAt'], (schema) => schema.optional())), updateReminder);
router.delete('/:id', deleteReminder);

export default router;
