// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
};

// Example schema for project creation
export const createProjectSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

// Example schema for task creation
export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').required(),
  assignedTo: Joi.string().required(),
  project: Joi.string().required(),
  dueDate: Joi.date().iso().required()
});