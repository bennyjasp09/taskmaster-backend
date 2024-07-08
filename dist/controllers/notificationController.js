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
exports.createNotification = exports.markNotificationAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const notifications = yield Notification_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId })
            .sort({ createdAt: -1 })
            .limit(20); // Get the 20 most recent notifications
        res.json(notifications);
    }
    catch (error) {
        res.status(400).json({ message: 'Error fetching notifications', error });
    }
});
exports.getNotifications = getNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const notification = yield Notification_1.default.findOneAndUpdate({ _id: req.params.id, user: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId }, { read: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating notification', error });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const createNotification = (userId, message, type, relatedItem) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notification = new Notification_1.default({
            user: userId,
            message,
            type,
            relatedItem
        });
        yield notification.save();
        return notification;
    }
    catch (error) {
        console.error('Error creating notification:', error);
    }
});
exports.createNotification = createNotification;
