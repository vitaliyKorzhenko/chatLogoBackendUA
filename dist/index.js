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
const teacherRouter_1 = __importDefault(require("./router/teacherRouter"));
const db_pools_1 = require("./db_pools");
const cronTasks_1 = require("./cronTasks");
const cors_1 = __importDefault(require("cors"));
const twilioWebhook_1 = __importDefault(require("./twilioWebhook"));
const chatLogoBot_1 = require("./chatLogoBot");
const app = (0, express_1.default)();
//use env port or 4030
const port = process.env.PORT || 4030;
// Подключаем middleware для обработки JSON
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Добавляем поддержку urlencoded данных
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api', teacherRouter_1.default);
app.use('/twilio', twilioWebhook_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
(0, socketHandler_1.default)(io);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server started at PORT :${port}`);
        try {
            //stop bot for test
            yield (0, cronTasks_1.syncTeachers)(db_pools_1.newUAPool, 'ua');
            // console.log("Teachers synced successfully!");
            // await findTeachersCustomer(uaPool, 'ua');
            // console.log("Teacher Customers found successfully!");
            yield (0, chatLogoBot_1.launchBot)();
            console.log('Bot launched successfully!');
        }
        catch (error) {
            console.error('Error launching bot:', error);
        }
    }
    catch (error) {
        console.error('Error starting server:', error);
    }
}));
