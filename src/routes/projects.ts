import express from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';
import { auth } from '../middleware/auth';
import { validateRequest, createProjectSchema } from '../middleware/validation';

const router = express.Router();

router.post('/', auth, validateRequest(createProjectSchema), createProject);
router.get('/', auth, getProjects);
router.get('/:id', auth, getProjectById);
router.put('/:id', auth, validateRequest(createProjectSchema), updateProject);
router.delete('/:id', auth, deleteProject);

export default router;