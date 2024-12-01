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
const sequelize_1 = require("sequelize");
const Teacher_1 = __importDefault(require("../models/Teacher"));
const Teacher_Customer_1 = __importDefault(require("../models/Teacher_Customer"));
class TeacherHelper {
    // Метод для создания нового учителя
    static createTeacher(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newTeacher = yield Teacher_1.default.create(data);
                console.log('New teacher created:', newTeacher.toJSON());
                return newTeacher;
            }
            catch (error) {
                console.error('Error creating new teacher:', error);
                throw error;
            }
        });
    }
    // Метод для получения учителя по ID
    static getTeacherById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacher = yield Teacher_1.default.findByPk(id);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                return teacher;
            }
            catch (error) {
                console.error('Error fetching teacher by ID:', error);
                throw error;
            }
        });
    }
    // Метод для получения всех учителей
    static getAllTeachers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teachers = yield Teacher_1.default.findAll();
                return teachers;
            }
            catch (error) {
                console.error('Error fetching all teachers:', error);
                throw error;
            }
        });
    }
    // Метод для обновления информации об учителе
    static updateTeacher(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacher = yield Teacher_1.default.findByPk(id);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                yield teacher.update(updateData);
                console.log('Teacher updated:', teacher.toJSON());
                return teacher;
            }
            catch (error) {
                console.error('Error updating teacher:', error);
                throw error;
            }
        });
    }
    // Метод для "удаления" учителя по ID (устанавливает isActive в false)
    static deleteTeacher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacher = yield Teacher_1.default.findByPk(id);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                yield teacher.update({ isActive: false });
                console.log('Teacher deactivated:', id);
                return teacher;
            }
            catch (error) {
                console.error('Error deactivating teacher:', error);
                throw error;
            }
        });
    }
    //create Teachers use ServeTeacher [] array 
    static syncTeachers(teachers_1) {
        return __awaiter(this, arguments, void 0, function* (teachers, source = 'main') {
            try {
                // Parse ServerTeacher to Teacher
                const teacherItems = teachers.map((teacher) => ({
                    serverId: teacher.serverId,
                    name: teacher.name,
                    phone: teacher.phone,
                    email: teacher.email,
                    source: source,
                    isActive: true,
                }));
                // Get existing teachers by serverId and source
                const serverIds = teachers.map(teacher => teacher.serverId.toString());
                const existingTeachers = yield Teacher_1.default.findAll({ where: { serverId: { [sequelize_1.Op.in]: serverIds }, source: source } });
                // Create or update teachers
                const existingTeacherIds = existingTeachers.map(teacher => teacher.serverId.toString());
                // Обновить существующих учителей одним запросом
                yield Teacher_1.default.update({
                    isActive: true,
                }, {
                    where: {
                        serverId: { [sequelize_1.Op.in]: existingTeacherIds },
                        source: source
                    }
                });
                // Найти учителей, которых нужно создать
                const newTeachersData = teacherItems.filter(teacher => !existingTeacherIds.includes(teacher.serverId.toString()));
                const newTeachers = yield Teacher_1.default.bulkCreate(newTeachersData);
                console.log('New teachers created:', newTeachers.map(teacher => teacher.toJSON()));
                return [...existingTeachers, ...newTeachers];
            }
            catch (error) {
                console.error('Error syncing teachers:', error);
                throw error;
            }
        });
    }
    static getTeachersIdServerId() {
        return __awaiter(this, arguments, void 0, function* (source = 'main') {
            try {
                const teachers = yield Teacher_1.default.findAll({
                    attributes: ['id', 'serverId'],
                    where: {
                        source: source
                    }
                });
                let teacherModels = teachers.map((teacher) => ({
                    id: teacher.id,
                    serverId: teacher.serverId,
                }));
                return teacherModels;
            }
            catch (error) {
                console.error('Error fetching teachers:', error);
                throw error;
            }
        });
    }
    //find teacher by serverId
    static findTeacherByServerId(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacher = yield Teacher_1.default.findOne({
                    where: {
                        serverId,
                    },
                });
                return teacher;
            }
            catch (error) {
                console.error('Error fetching teacher:', error);
                throw error;
            }
        });
    }
    //find teacher by email
    static findTeacherByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacher = yield Teacher_1.default.findOne({
                    where: {
                        email,
                    },
                });
                return teacher;
            }
            catch (error) {
                console.error('Error fetching teacher:', error);
                throw error;
            }
        });
    }
    //find teachers by source
    static findTeachersBySource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teachers = yield Teacher_1.default.findAll({
                    where: {
                        source,
                    },
                });
                return teachers;
            }
            catch (error) {
                console.error('Error fetching teachers:', error);
                throw error;
            }
        });
    }
    //create if not exist TeacherCustomer use 
    static createTeacherCustomerIfNotExist(teacherCustomer, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //get teachers for source
                const teachers = yield TeacherHelper.findTeachersBySource(source);
                const teacherIds = teachers.map((teacher) => teacher.id);
                const existingTeacherCustomers = yield Teacher_Customer_1.default.findAll({
                    where: {
                        teacherId: { [sequelize_1.Op.in]: teacherIds },
                    }
                });
                let newTeacherCustomerData = [];
                for (let i = 0; i < teacherCustomer.length; i++) {
                    let teacher = teachers.find((item) => item.serverId == teacherCustomer[i].teacherServerId.toString());
                    if (teacher) {
                        let currentTeacherCustomer = existingTeacherCustomers.find((item) => item.customerId == teacherCustomer[i].customerId.toString() && item.teacherId == teacher.id);
                        if (!currentTeacherCustomer) {
                            newTeacherCustomerData.push({
                                teacherId: teacher.id,
                                customerId: teacherCustomer[i].customerId,
                                customerName: teacherCustomer[i].customerName,
                                customerPhones: teacherCustomer[i].customerPhones,
                                customerEmails: teacherCustomer[i].customerEmails,
                                chatInfo: teacherCustomer[i].chatInfo,
                                isActive: true,
                                source: source,
                                channelId: teacherCustomer[i].channelId,
                                chatId: teacherCustomer[i].chatId,
                                trackingCode: teacherCustomer[i].trackingCode
                            });
                        }
                    }
                }
                console.log('NEW CUSTOMER LENGTH', newTeacherCustomerData.length);
                console.log('First New Teacher Customer:', newTeacherCustomerData[0]);
                const newTeacherCustomers = yield Teacher_Customer_1.default.bulkCreate(newTeacherCustomerData);
                console.log('new First Teacher Customer:', newTeacherCustomers[0]);
                // console.log('New teacher customers created:', newTeacherCustomers.map((item) => item.toJSON()));
                return [...existingTeacherCustomers, ...newTeacherCustomers];
            }
            catch (error) {
                console.error('Error creating teacher customers:', error);
                throw error;
            }
        });
    }
    //create teacher info with teacher customers (by email teacher)
    static findTeacherInfoWithCustomersByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const teacher = yield TeacherHelper.findTeacherByEmail(email);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                const teacherCustomers = yield Teacher_Customer_1.default.findAll({
                    where: {
                        teacherId: teacher.id,
                        isActive: true,
                    },
                    raw: true
                });
                let teacherInfoWithCustomer = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    source: (_b = teacher.source) !== null && _b !== void 0 ? _b : '',
                    customers: []
                };
                //add customers to teacherInfoWithCustomer
                teacherCustomers.forEach((item) => {
                    var _a, _b;
                    teacherInfoWithCustomer.customers.push({
                        customerId: Number(item.customerId),
                        customerName: item.customerName,
                        customerEmails: (_a = item.customerEmails) !== null && _a !== void 0 ? _a : [],
                        customerPhones: (_b = item.customerPhones) !== null && _b !== void 0 ? _b : [],
                        chatInfo: ''
                    });
                });
                return teacherInfoWithCustomer;
            }
            catch (error) {
                console.error('Error fetching teacher info with customers:', error);
                throw error;
            }
        });
    }
}
exports.default = TeacherHelper;
