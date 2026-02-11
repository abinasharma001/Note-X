import { Router } from 'express';
import {
  createNote,
  getNotes,
  getRecycleBin,
  hardDeleteNote,
  restoreNote,
  softDeleteNote,
  togglePin,
  undoLastEdit,
  updateNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { noteSchema } from '../utils/validators.js';

const router = Router();

router.use(protect);
router.get('/', getNotes);
router.post('/', upload.any(), validate(noteSchema), createNote);
router.patch('/:id', upload.any(), validate(noteSchema), updateNote);
router.patch('/:id/undo', undoLastEdit);
router.patch('/:id/pin', togglePin);
router.delete('/:id', softDeleteNote);

router.get('/recycle/bin', getRecycleBin);
router.patch('/recycle/:id/restore', restoreNote);
router.delete('/recycle/:id/permanent', hardDeleteNote);

export default router;
