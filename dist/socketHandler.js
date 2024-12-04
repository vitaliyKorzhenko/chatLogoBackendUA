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
exports.default = socketHandler;
const connectionTeachers_1 = require("./connectionTeachers");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        //Add new connection
        socket.on('addNewConnection', (email, id) => {
            console.log('Add new connection:', email, id);
            connectionTeachers_1.ConnectionTeacher.addOrUpdateConnectionTeacher(socket, email, id);
        });
        socket.on('selectClient', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('Select client:', data);
            try {
                let customerId = data.customerId;
                let teacherId = data.teacherId;
                let email = data.email;
                let messages = yield teacherHelper_1.default.findChatMessagesByTeacherIdAndCustomerIdAndSource(teacherId, customerId.toString(), 'ua');
                console.log('Messages:', messages.length);
                console.log('First message:', messages[0]);
                if (messages.length > 0) {
                    socket.emit('clientMessages', {
                        messages: messages,
                        clientId: customerId,
                    });
                }
            }
            catch (error) {
            }
        }));
        socket.on('message', (msg) => {
            console.log('Message from user:', msg);
            io.emit('message', msg);
        });
        socket.on('send_message', (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Send message:', data);
                let customerId = data.customerId;
                let teacherId = data.teacherId;
                let source = data.source;
                yield teacherHelper_1.default.createChatMessageForTeacher(teacherId, customerId, data.message.text, 'tg', source);
            }
            catch (error) {
            }
        }));
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            //Remove connection
            connectionTeachers_1.ConnectionTeacher.removeConnectionTeacher(socket);
        });
    });
}
