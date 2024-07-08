import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task';
import Project from '../models/Project';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedTo, project, dueDate } = req.body;
    const projectExists = await Project.findOne({ _id: project, members: new mongoose.Types.ObjectId(req.user?.userId) });
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found or you are not a member' });
    }
    const task = new Task({
      title,
      description,
      status,
      assignedTo,
      project,
      dueDate
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const memberProjects = await Project.find({ members: new mongoose.Types.ObjectId(req.user?.userId) });
    const memberProjectIds = memberProjects.map(project => project._id);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, project: { $in: memberProjectIds } },
      { $push: { comments: { user: req.user?.userId, content } } },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { status, priority, dueDate, sortBy, sortOrder } = req.query;

    let query: any = { project: projectId };

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate as string) };

    // Create sort object
    let sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    } else {
      sort = { createdAt: -1 }; // Default sort by creation date, newest first
    }

    const tasks = await Task.find(query)
      .sort(sort)
      .populate('assignedTo', 'username email')
      .populate('project', 'name');

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching tasks', error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('project', 'name');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching task', error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;
    const memberProjects = await Project.find({ members: new mongoose.Types.ObjectId(req.user?.userId) });
    const memberProjectIds = memberProjects.map(project => project._id);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, project: { $in: memberProjectIds } },
      { title, description, status, assignedTo, dueDate },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task', error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const memberProjects = await Project.find({ members: new mongoose.Types.ObjectId(req.user?.userId) });
    const memberProjectIds = memberProjects.map(project => project._id);
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      project: { $in: memberProjectIds }
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or you do not have permission' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task', error });
  }
};
