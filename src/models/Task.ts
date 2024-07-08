// src/models/Task.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  user: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignedTo: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  dueDate: Date;
  comments: IComment[];
}

const CommentSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  dueDate: { type: Date, required: true },
  comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.model<ITask>('Task', TaskSchema);