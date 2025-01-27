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
const sourceHelper_1 = require("./sourceHelper");
// Variable to store the io instance
let ioInstance = null;
function notifyClientOfNewMessage(teacherId, customerId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Step 1: Find teacher info by realChatId
            const teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByCustomerIdAndTeacherId(customerId, teacherId);
            // Get all connections
            const allConnections = connectionTeachers_1.ConnectionTeacher.connections;
            console.log('[Notify] All connections:', allConnections);
            if (teacherInfo && teacherInfo.teacherId) {
                // Step 2: Find all sockets for the teacherId
                const connections = connectionTeachers_1.ConnectionTeacher.findConnectionTeacherByTeacherId(teacherInfo.teacherId);
                if (connections && connections.length > 0) {
                    // Step 3: Notify all sockets
                    connections.forEach((connection) => {
                        console.log(`[Notify] Sending message to socketId=${connection.socketId}`);
                        connection.socket.emit('newMessage', { clientId: teacherInfo.customerId, message });
                    });
                }
                else {
                    console.warn(`[Notify] No connections found for teacherId: ${teacherInfo.teacherId}`);
                }
            }
            else {
                console.warn(`[Notify] No teacherInfo found for realChatId: ${customerId}${teacherId}`);
            }
        }
        catch (error) {
            console.error('[Notify] Error in notifyClientOfNewMessage:', error);
        }
    });
}
function updatedConnections(socket, email, id, teacherId) {
    console.log('[Socket] Add new connection:', email, id, teacherId);
    connectionTeachers_1.ConnectionTeacher.addOrUpdateConnectionTeacher(socket, email, teacherId);
    const updatedConnections = connectionTeachers_1.ConnectionTeacher.connections;
    console.warn('[Socket] All connections after adding:', {
        total: updatedConnections.length,
        details: updatedConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
    });
}
function socketHandler(io) {
    // Save ioInstance for external use
    ioInstance = io;
    io.on('connection', (socket) => {
        console.warn('[Socket] User connected:', socket.id + 'time: ' + new Date().toISOString());
        if (socket && socket.connected) {
            console.warn('[Socket] Conected socket EMIT confirmConnection' + 'time: ' + new Date().toISOString());
            socket.emit('confirmConnection', { message: 'Connected to server' });
        }
        // Log current connections
        const allConnections = connectionTeachers_1.ConnectionTeacher.connections;
        console.log('[Socket] Connections after new user connected:', {
            total: allConnections.length,
            details: allConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
        });
        // Add new connection
        socket.on('addNewConnection', ({ email, id, teacherId }) => {
            updatedConnections(socket, email, id, teacherId);
        });
        // Reconnect socket connection
        socket.on('reconnect_attempt', (attempt) => {
            console.warn(`[Socket] Reconnect attempt #${attempt} for socket ${socket.id}`);
            //updatedConnections(socket, socket.handshake.query.email, socket.handshake.query.id, socket.handshake.query.teacherId);
        });
        socket.on('reconnect', (attempt) => {
            console.log(`[Socket] Reconnected after ${attempt} attempts:`, socket.id);
        });
        socket.on('selectClient', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('[Socket] Select client:', data);
            try {
                const { customerId, teacherId } = data;
                console.log('[Socket] TeacherId, customerId:', teacherId, customerId);
                const messages = yield teacherHelper_1.default.findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString(), 50);
                //update isRead status
                yield teacherHelper_1.default.updateChatMessagesIsReadByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString(), sourceHelper_1.defaultSource);
                console.log('[Socket] Messages count:', messages.length);
                if (messages.length > 0) {
                    socket.emit('clientMessages', {
                        messages,
                        clientId: customerId,
                    });
                }
            }
            catch (error) {
                console.error('[Socket] Error in selectClient:', error);
            }
        }));
        socket.on('message', (msg) => {
            console.log('[Socket] Message from user:', msg);
            io.emit('message', msg);
        });
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.warn('[Socket] Send message:', data);
                const { customerId, teacherId, source, message } = data;
                yield teacherHelper_1.default.createChatMessage(teacherId, customerId, message.text, 'tg', source, 'teacher');
            }
            catch (error) {
                console.error('[Socket] Error in send_message:', error);
            }
        }));
        socket.on('message_from_teacher', (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                console.warn('[Socket] Message from teacher:', data);
                const { customerId, teacherId, source, message, isEmail, isFile } = data;
                yield teacherHelper_1.default.createChatMessage(teacherId, customerId, message.text, 'tg', source, 'teacher', isFile);
                const teacherInfo = yield teacherHelper_1.default.findTeacherCustomerByCustomerIdAndTeacherId(customerId.toString(), Number(teacherId));
                console.log('[Socket] TeacherInfo found:', teacherInfo);
                if ((_a = teacherInfo === null || teacherInfo === void 0 ? void 0 : teacherInfo.realChatId) === null || _a === void 0 ? void 0 : _a.length) {
                    const currentCustomer = yield teacherHelper_1.default.findCustomerAndTeacherNameAndEmailByCustomerIdAndTeacherId(customerId.toString(), teacherId);
                    if (currentCustomer) {
                        (0, centralSocket_1.sendMessageToCentralServer)({
                            message: message.text,
                            customer: currentCustomer,
                            isEmail,
                            isFile
                        });
                    }
                }
            }
            catch (error) {
                console.error('[Socket] Error in message_from_teacher:', error);
            }
        }));
        socket.on('disconnect', () => {
            console.error('[Socket] User disconnected:', socket.id);
            connectionTeachers_1.ConnectionTeacher.removeConnectionTeacher(socket);
            const updatedConnections = connectionTeachers_1.ConnectionTeacher.connections;
            console.warn('[Socket] All connections after disconnection:', {
                total: updatedConnections.length,
                details: updatedConnections.map(({ socketId, email, teacherId }) => ({ socketId, email, teacherId }))
            });
        });
        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
        });
    });
}
