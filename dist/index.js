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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socketHandler_1 = __importDefault(require("./socketHandler"));
const db_teachers_1 = require("./db_teachers");
const teacherHelper_1 = __importDefault(require("./helpers/teacherHelper"));
const teacherRouter_1 = __importDefault(require("./router/teacherRouter"));
const cors_1 = __importDefault(require("cors")); // Импортируем cors
const chatLogoBot_1 = require("./chatLogoBot");
const app = (0, express_1.default)();
//use env port or 4030
const port = process.env.PORT || 4030;
// Подключаем middleware для обработки JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: '*', // Разрешаем запросы с любого источника
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Подключаем ваш роутер на /api
app.use('/api', teacherRouter_1.default);
// Создаем HTTP сервер на основе Express
const server = http_1.default.createServer(app);
// // Создаем Socket.IO сервер и подключаем его к HTTP серверу
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
// Используем обработчик сокетов
(0, socketHandler_1.default)(io);
// Маршрут для проверки сервера
app.get('/', (req, res) => {
    res.send('Hello World!');
});
//startAllCronJobs();
function LoadChatMessagesFromSource(pool, source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //step 1 find current ChatLoader
            let chatLoader = yield teacherHelper_1.default.findChatLoaderBySource(source);
            if (!chatLoader) {
                console.log('ChatLoader not found for source:', source);
                return;
            }
            //findMessagesWithFullInfo use source and lastDate from chatLoader
            console.log('ChatLoader:', chatLoader);
            let rows = yield (0, db_teachers_1.findMessagesWithFullInfo)(pool, source, Number(chatLoader.serverId));
            if (rows) {
                console.log('Count:', rows.length);
                console.log('First row:', rows[0]);
                //parse rows and save to chat_messages ChatMessagesModel array
                let chatMessages = [];
                let orderNumber = chatLoader.orderNumber;
                //array customerIds
                let customerIds = rows.map((row) => row.customerId.toString());
                //find teacherId by customerId
                let teachers = yield teacherHelper_1.default.findTeacherCustomersByCustomerIdsAndSource(customerIds, source);
                console.log('Teachers-CUSTOMERS:', teachers.length);
                console.log('First Teacher:', teachers[0]);
                rows.forEach((row) => {
                    //1 find teacherId by customerId
                    let teacher = teachers.find((teacher) => teacher.customerId == row.customerId.toString());
                    console.log('Find Teacher', teacher);
                    if (teacher) {
                        let chatMessage = {
                            messageText: row.messageText,
                            teacherId: teacher.teacherId,
                            orderNumber: orderNumber,
                            customerId: row.customerId,
                            messageType: row.messageType,
                            attachemnt: '',
                            isActive: true,
                            serverDate: new Date(),
                            additionalInfo: {
                                alfaChatId: row.alfaChatId,
                                tgChatId: row.tgChatId,
                            },
                            serverId: row.messageId,
                            source: source,
                            inBound: true,
                        };
                        chatMessages.push(chatMessage);
                        orderNumber++;
                    }
                });
                //save chatMessages to chat_messages table
                console.log('ChatMessages:', chatMessages.length);
                console.log('Last ChatMessage:', chatMessages[chatMessages.length - 1]);
                yield teacherHelper_1.default.createChatMessages(chatMessages, source);
                //update chatLoader update last serverId and orderNumber
                yield teacherHelper_1.default.updateChatLoaderBySource(source, chatMessages[chatMessages.length - 1].serverId, orderNumber);
            }
        }
        catch (error) {
            console.error('Error fetching alfa messages:', error);
        }
    });
}
// Запуск сервера и затем вызов fetchAllTeachers
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server started at PORT :${port}`);
        try {
            yield (0, chatLogoBot_1.launchBot)();
            console.log('Bot launched successfully!');
        }
        catch (error) {
            console.error('Error launching bot:', error);
        }
        // await LoadChatMessagesFromSource(uaPool, 'ua');
        // await LoadChatMessagesFromSource(plPool, 'pl');
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}));
