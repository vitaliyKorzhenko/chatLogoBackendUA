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
const ChatLoaders_1 = __importDefault(require("../models/ChatLoaders"));
const ChatMessages_1 = __importDefault(require("../models/ChatMessages"));
const sourceHelper_1 = require("../sourceHelper");
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
    static createTeacherCustomerIfNotExist(teacherCustomer, source) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                // Get teachers for source
                const teachers = yield TeacherHelper.findTeachersBySource(source);
                const teacherIds = teachers.map((teacher) => teacher.id);
                // Fetch existing teacher customers
                const existingTeacherCustomers = yield Teacher_Customer_1.default.findAll({
                    where: {
                        teacherId: { [sequelize_1.Op.in]: teacherIds },
                    },
                });
                let newTeacherCustomerData = [];
                for (let i = 0; i < teacherCustomer.length; i++) {
                    let teacher = teachers.find((item) => item.serverId == teacherCustomer[i].teacherServerId.toString());
                    if (teacher) {
                        let currentTeacherCustomer = existingTeacherCustomers.find((item) => item.customerId == teacherCustomer[i].customerId.toString() &&
                            item.teacherId == teacher.id);
                        if (!currentTeacherCustomer) {
                            newTeacherCustomerData.push({
                                teacherId: teacher.id,
                                customerId: teacherCustomer[i].customerId,
                                customerName: teacherCustomer[i].customerName,
                                customerPhones: ((_a = teacherCustomer[i].customerPhones) === null || _a === void 0 ? void 0 : _a.length)
                                    ? teacherCustomer[i].customerPhones
                                    : sequelize_1.Sequelize.literal('ARRAY[]::text[]'), // Handle empty array
                                customerEmails: ((_b = teacherCustomer[i].customerEmails) === null || _b === void 0 ? void 0 : _b.length)
                                    ? teacherCustomer[i].customerEmails
                                    : sequelize_1.Sequelize.literal('ARRAY[]::text[]'), // Handle empty array
                                chatInfo: teacherCustomer[i].chatInfo,
                                isActive: true,
                                source: source,
                                channelId: teacherCustomer[i].channelId,
                                chatId: teacherCustomer[i].chatId,
                                trackingCode: teacherCustomer[i].trackingCode,
                            });
                        }
                    }
                }
                console.log('NEW CUSTOMER LENGTH', newTeacherCustomerData.length);
                console.log('First New Teacher Customer:', newTeacherCustomerData[0]);
                // Bulk create new teacher customers
                const newTeacherCustomers = yield Teacher_Customer_1.default.bulkCreate(newTeacherCustomerData);
                console.log('new First Teacher Customer:', newTeacherCustomers[0]);
                return [...existingTeacherCustomers, ...newTeacherCustomers];
            }
            catch (error) {
                console.error('Error creating teacher customers:', error);
                throw error;
            }
        });
    }
    //create teacher info with teacher customers (by email teacher)
    //find by teacherId and source array customersId + count unread messages (isRead = false or null) + total unread messages use only Table ChatMessages
    static findCustomersIdAndUnreadMessagesByTeacherIdAndSource(teacherId, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //ChatMessages groupBy teacherId, customerId, then count unread messages, and count toal unread messages
                const customers = yield ChatMessages_1.default.findAll({
                    attributes: ['customerId', [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('isRead')), 'unreadMessages']],
                    where: {
                        teacherId: teacherId,
                        source: source,
                        isRead: {
                            [sequelize_1.Op.or]: [false, null]
                        }
                    },
                    group: ['customerId'],
                    raw: true
                });
                return customers;
            }
            catch (error) {
                return [];
            }
        });
    }
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
                //step 2 - find customersId and unread messages
                const customersIdAndUnreadMessages = yield TeacherHelper.findCustomersIdAndUnreadMessagesByTeacherIdAndSource(teacher.id, sourceHelper_1.defaultSource);
                console.log('CustomersIdAndUnreadMessages:', customersIdAndUnreadMessages);
                //add customers to teacherInfoWithCustomer
                let totalUnreadMessages = 0;
                teacherCustomers.forEach((item) => {
                    //find customer in customersIdAndUnreadMessages
                    let customer = customersIdAndUnreadMessages.find((element) => element.customerId == item.customerId);
                    teacherInfoWithCustomer.customers.push({
                        customerId: Number(item.customerId),
                        customerName: item.customerName,
                        customerEmails: item.customerEmails ? [item.customerEmails] : [],
                        customerPhones: item.customerPhones ? [item.customerPhones] : [],
                        chatInfo: '',
                        //chat enabled if realChatId or realPhone not null
                        chatEnabled: item.realChatId || item.realPhone ? true : false,
                        unreadMessages: customer && customer.unreadMessages ? Number(customer.unreadMessages) : 0
                    });
                    if (customer && customer.unreadMessages) {
                        totalUnreadMessages += Number(customer.unreadMessages);
                    }
                });
                teacherInfoWithCustomer.totalUnreadMessages = totalUnreadMessages;
                return teacherInfoWithCustomer;
            }
            catch (error) {
                console.error('Error fetching teacher info with customers:', error);
                throw error;
            }
        });
    }
    //find chat Loader by source
    static findChatLoaderBySource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatLoader = yield ChatLoaders_1.default.findOne({
                    where: {
                        source: source
                    },
                    raw: true
                });
                return chatLoader;
            }
            catch (error) {
                console.error('Error fetching chat loader:', error);
                throw error;
            }
        });
    }
    //update Chat Loader by source (serverId, orderNumber)
    static updateChatLoaderBySource(source, serverId, orderNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //update chat loader where source = source
                const chatLoader = yield ChatLoaders_1.default.findOne({
                    where: {
                        source: source
                    }
                });
                if (!chatLoader) {
                    console.log('Chat Loader not found');
                    return null;
                }
                yield chatLoader.update({
                    serverId: serverId,
                    orderNumber: orderNumber
                });
                console.log('Chat Loader updated:', chatLoader.toJSON());
                return chatLoader;
            }
            catch (error) {
                console.error('Error updating chat loader:', error);
                throw error;
            }
        });
    }
    //create Chat Messages use ChatMessagesModel[] array (and update chat loader)
    static createChatMessages(chatMessages, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatLoader = yield TeacherHelper.findChatLoaderBySource(source);
                if (!chatLoader) {
                    console.log('Chat Loader not found');
                    return null;
                }
                let newChatMessagesData = [];
                for (let i = 0; i < chatMessages.length; i++) {
                    newChatMessagesData.push({
                        messageText: chatMessages[i].messageText,
                        teacherId: chatMessages[i].teacherId,
                        orderNumber: chatMessages[i].orderNumber,
                        customerId: chatMessages[i].customerId,
                        messageType: chatMessages[i].messageType,
                        attachemnt: chatMessages[i].attachemnt,
                        isActive: true,
                        serverDate: new Date(),
                        additionalInfo: chatMessages[i].additionalInfo,
                        source: source,
                        serverId: chatMessages[i].serverId,
                    });
                }
                const newChatMessages = yield ChatMessages_1.default.bulkCreate(newChatMessagesData);
                console.log('New chat messages created:', newChatMessages.map((item) => item.toJSON()));
                yield TeacherHelper.updateChatLoaderBySource(source, chatMessages[chatMessages.length - 1].serverId, chatMessages[chatMessages.length - 1].orderNumber);
                return newChatMessages;
            }
            catch (error) {
                console.error('Error creating chat messages:', error);
                throw error;
            }
        });
    }
    //find teachers by customer id and source 
    static findTeacherByCustomerIdAndSource(customerId, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        customerId: customerId,
                        source: source,
                        isActive: true
                    }
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                return teacherCustomer;
            }
            catch (error) {
                console.error('Error fetching teachers:', error);
                throw error;
            }
        });
    }
    //find all teachers customer by customerIds array and source
    static findTeacherCustomersByCustomerIdsAndSource(customerIds, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherCustomers = yield Teacher_Customer_1.default.findAll({
                    where: {
                        customerId: { [sequelize_1.Op.in]: customerIds },
                        source: source,
                        isActive: true
                    },
                    raw: true
                });
                return teacherCustomers;
            }
            catch (error) {
                console.error('Error fetching teachers:', error);
                throw error;
            }
        });
    }
    //find ChatMessages by teacherId and customerId and source
    static findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId_1, customerId_1) {
        return __awaiter(this, arguments, void 0, function* (teacherId, customerId, limit = 50) {
            try {
                const chatMessages = yield ChatMessages_1.default.findAll({
                    where: {
                        teacherId: teacherId,
                        customerId: customerId,
                    },
                    raw: true,
                    limit: limit,
                });
                return chatMessages;
            }
            catch (error) {
                console.error('Error fetching chat messages:', error);
                throw error;
            }
        });
    }
    //update ChatMessages isRead (set -> true) by teacherId and customerId and source
    static updateChatMessagesIsReadByTeacherIdAndCustomerIdAndSource(teacherId, customerId, source) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ChatMessages_1.default.update({
                    isRead: true
                }, {
                    where: {
                        teacherId: teacherId,
                        customerId: customerId,
                        source: source
                    }
                });
                return true;
            }
            catch (error) {
                console.error('Error updating chat messages:', error);
                return false;
            }
        });
    }
    //create ChatMessages use teacherId, customerId, messageText, messageType, source
    static createChatMessage(teacherId_1, customerId_1, messageText_1, messageType_1, source_1, sender_1) {
        return __awaiter(this, arguments, void 0, function* (teacherId, customerId, messageText, messageType, source, sender, isFile = false) {
            try {
                const newChatMessage = yield ChatMessages_1.default.create({
                    messageText,
                    teacherId,
                    customerId,
                    messageType,
                    source,
                    isActive: true,
                    serverDate: new Date(),
                    sender: sender,
                    serverId: '0',
                    format: isFile ? 'file' : 'text'
                });
                console.log('New chat message created:', newChatMessage.toJSON());
                return newChatMessage;
            }
            catch (error) {
                console.error('Error creating chat message:', error);
                return null;
            }
        });
    }
    //find customer name and customer email by customerId and teacherId
    static findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        customerId: customerId,
                        teacherId: teacherId,
                        isActive: true
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                console.log('===============FIND TEACHER CUSTOMER ==============', teacherCustomer);
                //find teacher by teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                //add teacher name and email to teacherCustomer
                //parse {vitaliy@gmail.com, nextemail@gmail.com}
                let emails = teacherCustomer && teacherCustomer.customerEmails ? teacherCustomer.customerEmails : [];
                let result = {
                    customerEmails: emails,
                    customerName: teacherCustomer.customerName,
                    teacherName: teacher.name,
                    teacherId: teacher.id,
                    customerId: teacherCustomer.customerId,
                    chatId: teacherCustomer.realChatId ? teacherCustomer.realChatId : '',
                    source: sourceHelper_1.defaultSource,
                    customerPhones: teacherCustomer.customerPhones,
                    phone: teacherCustomer.realPhone ? teacherCustomer.realPhone : ''
                };
                return result;
            }
            catch (error) {
                console.error('========== ERROR findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId ==========:', error);
                return null;
            }
        });
    }
    //find teacher customer (with teacher info - teacher name id) by chatId
    static findTeacherCustomerByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        chatId: chatId,
                        isActive: true
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                //find teacher by teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                let resultInfo = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    customerName: teacherCustomer.customerName,
                    customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                    customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                    customerId: teacherCustomer.customerId,
                    chatInfo: teacherCustomer.chatInfo,
                    source: teacherCustomer.source,
                    chatId: teacherCustomer.chatId,
                    realChatId: teacherCustomer.realChatId
                };
                return resultInfo;
            }
            catch (error) {
                console.error('Error fetching teacher customer:', error);
                return null;
            }
        });
    }
    ///find teacher customer (with teacher info - teacher name id) by realChatId
    static findTeacherCustomerByRealChatId(realChatId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        realChatId: realChatId,
                        isActive: true
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                //find teacher by teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                let resultInfo = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    customerName: teacherCustomer.customerName,
                    customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                    customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                    customerId: teacherCustomer.customerId,
                    chatInfo: teacherCustomer.chatInfo,
                    source: teacherCustomer.source,
                    chatId: teacherCustomer.chatId,
                    realChatId: teacherCustomer.realChatId
                };
                return resultInfo;
            }
            catch (error) {
                console.error('Error fetching teacher customer:', error);
                return null;
            }
        });
    }
    //find teacher customer (with teacher info) by teacherId and customerId
    static findTeacherCustomerByTeacherIdAndCustomerId(teacherId, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        customerId: customerId,
                        teacherId: teacherId,
                        isActive: true
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                //find teacher by teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                let resultInfo = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    customerName: teacherCustomer.customerName,
                    customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                    customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                    customerId: teacherCustomer.customerId,
                    chatInfo: teacherCustomer.chatInfo,
                    source: teacherCustomer.source,
                    chatId: teacherCustomer.chatId,
                    realChatId: teacherCustomer.realChatId
                };
                return resultInfo;
            }
            catch (error) {
                console.error('Error fetching teacher customer:', error);
                return null;
            }
        });
    }
    //upudate realChatId   by customerId and teacherId 
    static updateRealChatIdByCustomerIdAndTeacherId(customerId, teacherId, realChatId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        customerId: customerId,
                        teacherId: teacherId,
                        isActive: true
                    }
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                yield teacherCustomer.update({
                    realChatId: realChatId
                });
                console.log('Teacher Customer updated:', teacherCustomer.toJSON());
                return teacherCustomer;
            }
            catch (error) {
                console.error('Error updating teacher customer:', error);
                throw error;
            }
        });
    }
    //find teacher customer (teacher info TeacherInfoModel) by customerId and teacherId
    static findTeacherCustomerByCustomerIdAndTeacherId(customerId, teacherId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        customerId: customerId,
                        teacherId: teacherId,
                        isActive: true
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                //find teacher by teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                let resultInfo = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    customerName: teacherCustomer.customerName,
                    customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                    customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                    customerId: teacherCustomer.customerId,
                    chatInfo: teacherCustomer.chatInfo,
                    source: teacherCustomer.source,
                    chatId: teacherCustomer.chatId,
                    realChatId: teacherCustomer.realChatId
                };
                return resultInfo;
            }
            catch (error) {
                console.error('Error fetching teacher customer:', error);
                return null;
            }
        });
    }
    //find teacher customer by phone (teacher info TeacherInfoModel)
    static findTeacherCustomerByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Нормализуем телефон: убираем символ '+' и любые нечисловые символы
                const normalizedPhone = phone.replace(/\D/g, '');
                console.log(`Normalized phone for search: ${normalizedPhone}`);
                // Ищем клиента в базе данных
                const teacherCustomer = yield Teacher_Customer_1.default.findOne({
                    where: {
                        [sequelize_1.Op.and]: [
                            sequelize_1.Sequelize.literal(`'${normalizedPhone}' = ANY(string_to_array("customerPhones", ','))`),
                            { isActive: true }
                        ]
                    },
                    raw: true
                });
                if (!teacherCustomer) {
                    console.log('Teacher Customer not found');
                    return null;
                }
                // Ищем учителя по teacherId
                const teacher = yield TeacherHelper.getTeacherById(teacherCustomer.teacherId);
                if (!teacher) {
                    console.log('Teacher not found');
                    return null;
                }
                // Собираем итоговую информацию
                const resultInfo = {
                    teacherId: teacher.id,
                    teacherName: teacher.name,
                    teacherEmail: (_a = teacher.email) !== null && _a !== void 0 ? _a : '',
                    customerName: teacherCustomer.customerName,
                    customerEmails: teacherCustomer.customerEmails ? [teacherCustomer.customerEmails] : [],
                    customerPhones: teacherCustomer.customerPhones ? [teacherCustomer.customerPhones] : [],
                    customerId: teacherCustomer.customerId,
                    chatInfo: teacherCustomer.chatInfo,
                    source: teacherCustomer.source,
                    chatId: teacherCustomer.chatId,
                    realChatId: teacherCustomer.realChatId
                };
                return resultInfo;
            }
            catch (error) {
                console.error('Error fetching teacher customer:', error);
                return null;
            }
        });
    }
}
exports.default = TeacherHelper;
