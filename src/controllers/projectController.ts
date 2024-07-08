import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project';
import { AppError } from '../utils/errorHandler';

export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
    const query: any = { members: new mongoose.Types.ObjectId(req.user?.userId) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const sort: any = { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 };
    const projects = await Project.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Project.countDocuments(query);
    res.json({
      projects,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    next(new AppError('Error fetching projects', 400));
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const project = new Project({
      name,
      description,
      owner: new mongoose.Types.ObjectId(req.user?.userId),
      members: [new mongoose.Types.ObjectId(req.user?.userId)]
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    next(new AppError('Error creating project', 400));
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, members: new mongoose.Types.ObjectId(req.user?.userId) });
    if (!project) {
      return next(new AppError('Project not found', 404));
    }
    res.json(project);
  } catch (error) {
    next(new AppError('Error fetching project', 400));
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: new mongoose.Types.ObjectId(req.user?.userId) },
      { name, description },
      { new: true }
    );
    if (!project) {
      return next(new AppError('Project not found or you are not the owner', 404));
    }
    res.json(project);
  } catch (error) {
    next(new AppError('Error updating project', 400));
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: new mongoose.Types.ObjectId(req.user?.userId) });
    if (!project) {
      return next(new AppError('Project not found or you are not the owner', 404));
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(new AppError('Error deleting project', 400));
  }
};
