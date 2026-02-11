import { Router } from 'express';
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { taskSchema } from '../utils/validators.js';

const router = Router({ mergeParams: true });

router.use(protect);
router.get('/', listTasks);
router.post('/', validate(taskSchema), createTask);
router.patch('/:taskId', validate(taskSchema.fork(['text'], (schema) => schema.optional())), updateTask);
router.delete('/:taskId', deleteTask);

export default router;
