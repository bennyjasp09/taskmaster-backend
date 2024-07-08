// src/models/Notification.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  type: 'task_assigned' | 'task_updated' | 'project_invitation';
  relatedItem: mongoose.Types.ObjectId;
}

const NotificationSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, required: true },
  relatedItem: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

export default mongoose.model<INotification>('Notification', NotificationSchema);