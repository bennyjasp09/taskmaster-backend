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
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const errorHandler_1 = require("../utils/errorHandler");
const getProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.query;
        const query = { members: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId };
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        const projects = yield Project_1.default.find(query)
            .sort(sort)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield Project_1.default.countDocuments(query);
        res.json({
            projects,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            total
        });
    }
    catch (error) {
        next(new errorHandler_1.AppError('Error fetching projects', 400));
    }
});
exports.getProjects = getProjects;
const createProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    try {
        const { name, description } = req.body;
        const project = new Project_1.default({
            name,
            description,
            owner: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            members: [(_c = req.user) === null || _c === void 0 ? void 0 : _c.userId]
        });
        yield project.save();
        res.status(201).json(project);
    }
    catch (error) {
        next(new errorHandler_1.AppError('Error creating project', 400));
    }
});
exports.createProject = createProject;
const getProjectById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const project = yield Project_1.default.findOne({ _id: req.params.id, members: (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId });
        if (!project) {
            return next(new errorHandler_1.AppError('Project not found', 404));
        }
        res.json(project);
    }
    catch (error) {
        next(new errorHandler_1.AppError('Error fetching project', 400));
    }
});
exports.getProjectById = getProjectById;
const updateProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { name, description } = req.body;
        const project = yield Project_1.default.findOneAndUpdate({ _id: req.params.id, owner: (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId }, { name, description }, { new: true });
        if (!project) {
            return next(new errorHandler_1.AppError('Project not found or you are not the owner', 404));
        }
        res.json(project);
    }
    catch (error) {
        next(new errorHandler_1.AppError('Error updating project', 400));
    }
});
exports.updateProject = updateProject;
const deleteProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const project = yield Project_1.default.findOneAndDelete({ _id: req.params.id, owner: (_f = req.user) === null || _f === void 0 ? void 0 : _f.userId });
        if (!project) {
            return next(new errorHandler_1.AppError('Project not found or you are not the owner', 404));
        }
        res.json({ message: 'Project deleted successfully' });
    }
    catch (error) {
        next(new errorHandler_1.AppError('Error deleting project', 400));
    }
});
exports.deleteProject = deleteProject;
