"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTaskSchema = exports.createProjectSchema = exports.validateRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
// Example schema for project creation
exports.createProjectSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required()
});
// Example schema for task creation
exports.createTaskSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    status: joi_1.default.string().valid('To Do', 'In Progress', 'Done').required(),
    assignedTo: joi_1.default.string().required(),
    project: joi_1.default.string().required(),
    dueDate: joi_1.default.date().iso().required()
});
