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
exports.notifyClientOfNewMessage = notifyClientOfNewMessage;
exports.default = socketHandler;
const connectionTeachers_1 = require("./connectionTeachers");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const centralSocket_1 = require("./centralSocket");
// Переменная для хранения экземпляра io
let ioInstance = null;
function notifyClientOfNewMessage(teacherId, customerId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Step 1: Find teacher info by realChatId
            const teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByCustomerIdAndTeacherId(customerId, teacherId);
            //get all connections
            let allConnections = connectionTeachers_1.ConnectionTeacher.connections;
            console.log('All connections:', allConnections);
            if (teacherInfo && teacherInfo.teacherId) {
                // Step 2: Find all sockets for the teacherId
                const connections = connectionTeachers_1.ConnectionTeacher.findConnectionTeacherByTeacherId(teacherInfo.teacherId);
                if (connections && connections.length > 0) {
                    // Step 3: Notify all sockets
                    connections.forEach((connection) => {
                        connection.socket.emit('newMessage', { clientId: teacherInfo.customerId, message });
                    });
                }
                else {
                    console.warn(`No connections found for teacherId: ${teacherInfo.teacherId}`);
                }
            }
            else {
                console.warn(`No teacherInfo found for realChatId: ${customerId}${teacherId}`);
            }
        }
        catch (error) {
            console.error('Error in notifyClientOfNewMessage:', error);
        }
    });
}
function socketHandler(io) {
    // Сохраняем ioInstance для внешнего использования
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        //on connect add new connection
        // Add new connection
        socket.on('addNewConnection', ({ email, id, teacherId }) => {
            console.log('Add new connection:', email, id, teacherId);
            connectionTeachers_1.ConnectionTeacher.addOrUpdateConnectionTeacher(socket, email, teacherId);
            //beforea add new conection logs all connections
            let allConnections = connectionTeachers_1.ConnectionTeacher.connections;
            console.warn('All connections:', allConnections);
        });
        socket.on('selectClient', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('Select client:', data);
            try {
                const { customerId, teacherId } = data;
                console.log('TeacherId, customerId:', teacherId, customerId);
                const messages = yield teacherHelper_1.default.findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString());
                console.log('Messages:', messages.length);
                console.log('First message:', messages[0]);
                if (messages.length > 0) {
                    socket.emit('clientMessages', {
                        messages,
                        clientId: customerId,
                    });
                }
            }
            catch (error) {
                console.error('Error in selectClient:', error);
            }
        }));
        socket.on('message', (msg) => {
            console.log('Message from user:', msg);
            io.emit('message', msg);
        });
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.warn('Send message:', data);
                const { customerId, teacherId, source, message } = data;
                yield teacherHelper_1.default.createChatMessage(teacherId, customerId, message.text, 'tg', source, 'teacher');
                // Уведомляем фронт о новом сообщении
                // notifyClientOfNewMessage(customerId, message.text);
            }
            catch (error) {
                console.error('Error in send_message:', error);
            }
        }));
        socket.on('message_from_teacher', (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.warn('MESSAGE FROM TEACHER!', data);
                const { customerId, teacherId, source, message, isEmail } = data;
                yield teacherHelper_1.default.createChatMessage(teacherId, customerId, message.text, 'tg', source, 'teacher');
                const teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByCustomerIdAndTeacherId(customerId.toString(), Number(teacherId));
                console.log('TeacherInfo FIND!:', teacherInfo);
                if ((_a = teacherInfo === null || teacherInfo === void 0 ? void 0 : teacherInfo.realChatId) === null || _a === void 0 ? void 0 : _a.length) {
                    let currentCustomer = yield teacherHelper_1.default.findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId.toString(), teacherId);
                    if (currentCustomer) {
                        (0, centralSocket_1.sendMessageToCentralServer)({
                            message: message.text,
                            customer: currentCustomer,
                            isEmail: isEmail,
                        });
                    }
                }
                // Уведомляем фронт о новом сообщении
                // notifyClientOfNewMessage(customerId, message.text);
            }
            catch (error) {
                console.error('Error in message_from_teacher:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.error('USER DISCONNECTED:', socket.id);
            connectionTeachers_1.ConnectionTeacher.removeConnectionTeacher(socket);
        });
        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
        });
        socket.on('reconnect_attempt', (attempt) => {
            console.warn(`Reconnect attempt #${attempt} for socket ${socket.id}`);
        });
        socket.on('reconnect', (attempt) => {
            console.log(`Socket reconnected after ${attempt} attempts:`, socket.id);
        });
    });
}
