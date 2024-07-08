// src/controllers/notificationController.ts
import { Request, Response } from 'express';
import Notification, { INotification } from '../models/Notification';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ user: req.user?.userId })
      .sort({ createdAt: -1 })
      .limit(20); // Get the 20 most recent notifications
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching notifications', error });
  }
};

export const markNotificationAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user?.userId },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Error updating notification', error });
  }
};

export const createNotification = async (userId: string, message: string, type: string, relatedItem: string) => {
  try {
    const notification = new Notification({
      user: userId,
      message,
      type,
      relatedItem
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};