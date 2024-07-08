"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/', auth_1.auth, (0, validation_1.validateRequest)(validation_1.createProjectSchema), projectController_1.createProject);
router.get('/', auth_1.auth, projectController_1.getProjects);
router.get('/:id', auth_1.auth, projectController_1.getProjectById);
router.put('/:id', auth_1.auth, (0, validation_1.validateRequest)(validation_1.createProjectSchema), projectController_1.updateProject);
router.delete('/:id', auth_1.auth, projectController_1.deleteProject);
exports.default = router;
