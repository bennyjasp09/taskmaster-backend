// src/routes/notifications.ts
import express from 'express';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getNotifications);
router.put('/:id/read', auth, markNotificationAsRead);

export default router;