// src/routes/tasks.ts
import express from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController';
import { auth } from '../middleware/auth';
import { validateRequest, createTaskSchema } from '../middleware/validation';

const router = express.Router();

router.post('/', auth, validateRequest(createTaskSchema), createTask);
router.get('/project/:projectId', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, validateRequest(createTaskSchema), updateTask);
router.delete('/:id', auth, deleteTask);

export default router;