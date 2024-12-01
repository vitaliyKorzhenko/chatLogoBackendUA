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
const express_1 = __importDefault(require("express"));
const teacherHelper_1 = __importDefault(require("../helpers/teacherHelper"));
require('dotenv').config();
const router = express_1.default.Router();
// Middleware to check token for all requests
const tokenMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token || token !== process.env.AUTH_TOKEN) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};
// Apply tokenMiddleware to all routes under /api
router.use('/', tokenMiddleware);
// Method to get all active teachers
router.get('/teachers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teachers = yield teacherHelper_1.default.getAllTeachers();
        res.json(teachers);
    }
    catch (error) {
        console.error('Error fetching all teachers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Method to create a new teacher
router.post('/teacher', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serverId, name, phone, email, source, isActive } = req.body;
    if (!serverId || !name || !email) {
        return res.status(400).json({ message: 'serverId, name, and email are required' });
    }
    try {
        const newTeacher = yield teacherHelper_1.default.createTeacher({ serverId, name, phone, email, source, isActive });
        res.status(201).json(newTeacher);
    }
    catch (error) {
        console.error('Error creating new teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Method to update teacher information
router.put('/teacher/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedTeacher = yield teacherHelper_1.default.updateTeacher(Number(id), updateData);
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(updatedTeacher);
    }
    catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
// Method to "delete" a teacher (sets isActive to false)
router.delete('/teacher/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTeacher = yield teacherHelper_1.default.deleteTeacher(Number(id));
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deactivated' });
    }
    catch (error) {
        console.error('Error deactivating teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
//find teacher by email post method
router.post('/teacher/email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const teacher = yield teacherHelper_1.default.findTeacherByEmail(email);
        if (!teacher) {
            return res.status(200).json(null);
        }
        res.json(teacher);
    }
    catch (error) {
        console.error('Error fetching teacher by email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
//find teacher info by email post method
router.post('/teacher/info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('======= Start find teacher info by email =====', req.body);
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const teacher = yield teacherHelper_1.default.findTeacherInfoWithCustomersByEmail(email);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    }
    catch (error) {
        console.error('Error fetching teacher by email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
exports.default = router;
