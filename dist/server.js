"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const errorHandler_1 = require("./utils/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/notifications', notifications_1.default);
app.use((err, req, res, next) => {
    (0, errorHandler_1.handleError)(err, res);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
