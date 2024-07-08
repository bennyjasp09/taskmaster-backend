"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.addComment = exports.createTask = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Project_1 = __importDefault(require("../models/Project"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status, assignedTo, project, dueDate } = req.body;
        const projectExists = yield Project_1.default.findOne({ _id: project, members: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
        if (!projectExists) {
            return res.status(404).json({ message: 'Project not found or you are not a member' });
        }
        const task = new Task_1.default({
            title,
            description,
            status,
            assignedTo,
            project,
            dueDate
        });
        yield task.save();
        res.status(201).json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
});
exports.createTask = createTask;
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { content } = req.body;
        const task = yield Task_1.default.findOneAndUpdate({ _id: req.params.id, project: { $in: yield Project_1.default.find({ members: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }) } }, { $push: { comments: { user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, content } } }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error adding comment', error });
    }
});
exports.addComment = addComment;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { projectId } = req.params;
        const { status, priority, dueDate, sortBy, sortOrder } = req.query;
        let query = { project: projectId };
        // Apply filters
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (dueDate)
            query.dueDate = { $lte: new Date(dueDate) };
        // Create sort object
        let sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }
        else {
            sort = { createdAt: -1 }; // Default sort by creation date, newest first
        }
        const tasks = yield Task_1.default.find(query)
            .sort(sort)
            .populate('assignedTo', 'username email')
            .populate('project', 'name');
        res.json(tasks);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching tasks', error });
    }
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield Task_1.default.findById(req.params.id)
            .populate('assignedTo', 'username email')
            .populate('project', 'name');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching task', error });
    }
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const task = yield Task_1.default.findOneAndUpdate({ _id: req.params.id, project: { $in: yield Project_1.default.find({ members: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }) } }, { title, description, status, assignedTo, dueDate }, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission' });
        }
        res.json(task);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const task = yield Task_1.default.findOneAndDelete({
            _id: req.params.id,
            project: { $in: yield Project_1.default.find({ members: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId }) }
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission' });
        }
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
});
exports.deleteTask = deleteTask;
