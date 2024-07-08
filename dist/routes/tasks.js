"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/tasks.ts
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/', auth_1.auth, (0, validation_1.validateRequest)(validation_1.createTaskSchema), taskController_1.createTask);
router.get('/project/:projectId', auth_1.auth, taskController_1.getTasks);
router.get('/:id', auth_1.auth, taskController_1.getTaskById);
router.put('/:id', auth_1.auth, (0, validation_1.validateRequest)(validation_1.createTaskSchema), taskController_1.updateTask);
router.delete('/:id', auth_1.auth, taskController_1.deleteTask);
exports.default = router;
